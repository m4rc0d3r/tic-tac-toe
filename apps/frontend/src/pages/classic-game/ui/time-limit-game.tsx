import type {
  ColorStop,
  GameState,
  Move,
  Player,
  Vec2,
  WinningLineParams,
} from "@tic-tac-toe/core";
import {
  BOARD_AREA,
  buildBoard,
  calculateColorFromGradient,
  findBestMove,
  getGameState,
  getOpponent,
  getWinningLineParams,
  isEven,
  isMoveAllowed,
  PLAYERS,
  positionFromIndex,
  positionToIndex,
  SPACE,
  X,
} from "@tic-tac-toe/core";
import type { ComponentProps, CSSProperties } from "react";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import Countdown from "react-countdown";
import type { Entries } from "type-fest";

import { ICONS_BY_PLAYER } from "./shared";
import type { WinningLineInstanceRef } from "./winning-line";
import { WinningLine } from "./winning-line";

import type { User } from "~/entities/user";
import { UserAvatar } from "~/entities/user";
import { TRANSLATION_KEYS, useTranslation2 } from "~/shared/i18n";
import { rgb } from "~/shared/lib/css";
import { asPercentage, toSeconds } from "~/shared/lib/format";
import type { PlayerIconInstanceRef } from "~/shared/ui/player-icons";
import { Progress } from "~/shared/ui/progress";
import { cn } from "~/shared/ui/utils";

const DELAY_BEFORE_BOT_MOVE = 1000;
const DEFAULT_COUNTDOWN_PROPS: Partial<ComponentProps<typeof Countdown>> = {
  intervalDelay: 100,
  precision: 1,
  autoStart: false,
};

const STOPWATCH_INTERVAL = 100;

type GameState2 =
  | {
      status: "NOT_STARTED";
    }
  | Exclude<GameState, { result: "VICTORY" }>
  | (Extract<GameState, { result: "VICTORY" }> & {
      reason: "N_IN_ROW" | "TIME_IS_UP";
    });

type PlayerInfo = Pick<User, "firstName" | "lastName" | "avatar">;
type PlayersInfo = Record<Player, PlayerInfo>;

type WhoseMoveIsFirst = "I" | "OPPONENT";
type GameOverState = Extract<GameState, { status: "OVER" }>;
type Props = ComponentProps<"div"> & {
  playersInfo: PlayersInfo;
  myPlayer?: Player | undefined;
  whoseMoveIsFirst?: WhoseMoveIsFirst | undefined;
  timePerMove?: number | undefined;
  timePerPlayer?: number | undefined;
  initialMoves?: Move[] | undefined;
  delayBeforeGameStarts?: number | undefined;
  onGameOver?: ((gameState: GameOverState) => void) | undefined;
  onGameOverDelay?: number | undefined;
};

function ClassicTimeLimitGame({
  playersInfo,
  myPlayer = X,
  whoseMoveIsFirst = "I",
  timePerMove,
  timePerPlayer,
  initialMoves = [
    // { player: "X", position: { x: 2, y: 0 } },
    // { player: "O", position: { x: 1, y: 1 } },
    // { player: "X", position: { x: 0, y: 0 } },
    // { player: "O", position: { x: 1, y: 0 } },
    // { player: "X", position: { x: 1, y: 2 } },
    // { player: "O", position: { x: 0, y: 1 } },
    // { player: "X", position: { x: 0, y: 2 } },
  ],
  delayBeforeGameStarts = 2000,
  className,
  onGameOver,
  onGameOverDelay = 100,
  ...props
}: Props) {
  const {
    translation: { t },
    postproc: { tc },
  } = useTranslation2();

  const opponent = getOpponent(myPlayer);
  const firstPlayer = whoseMoveIsFirst === "I" ? myPlayer : opponent;

  const [moves, setMoves] = useState<Move[]>(initialMoves);
  const [gameState, setGameState] = useState<GameState2>({ status: "NOT_STARTED" });
  const [winningLineParams, setWinningLineParams] = useState<WinningLineParams | null>(null);
  const winningLineRef = useRef<WinningLineInstanceRef>(null);

  const whoseTurn = isEven(moves.length) ? firstPlayer : getOpponent(firstPlayer);
  const board = buildBoard(moves);

  const playerIconRefs = useRef(new Array<PlayerIconInstanceRef | null>(BOARD_AREA).fill(null));
  const playerIconAnimation = useRef<Animation>(null);

  const pregameCountdownRef = useRef<Countdown>(null);
  const gameStartsAt = useRef(Date.now() + delayBeforeGameStarts);

  const [playersRemainingTime, setPlayersRemainingTime] = useState(
    typeof timePerPlayer === "number"
      ? (Object.fromEntries(PLAYERS.map((player) => [player, timePerPlayer])) as Record<
          Player,
          number
        >)
      : null,
  );
  const [timeRemainingToMove, setTimeRemainingToMove] = useState(timePerMove);

  const stopwatchIntervalId = useRef<number>(null);

  const startStopwatch = () => {
    stopStopwatch();
    stopwatchIntervalId.current = window.setInterval(() => {
      if (playersRemainingTime) {
        setPlayersRemainingTime((prev) =>
          prev
            ? {
                ...prev,
                ...{ [whoseTurn]: prev[whoseTurn] - STOPWATCH_INTERVAL },
              }
            : prev,
        );
      }
      setTimeRemainingToMove((prev) =>
        typeof prev === "number" ? prev - STOPWATCH_INTERVAL : prev,
      );
    }, STOPWATCH_INTERVAL);
  };

  const stopStopwatch = () => {
    if (typeof stopwatchIntervalId.current !== "number") return;

    clearInterval(stopwatchIntervalId.current);
    stopwatchIntervalId.current = null;
  };

  const startGame = () => {
    setGameState({ status: "IN_PROGRESS" });
    startStopwatch();
  };

  const isGameInProgress = useCallback(
    () => gameState.status === "IN_PROGRESS",
    [gameState.status],
  );

  const makeMove = useCallback(
    (player: Player, position: Vec2) => {
      stopStopwatch();
      const newMoves = [...moves, { player, position }];
      const board = buildBoard(newMoves);
      const newGameState = getGameState(board);
      setMoves(newMoves);
      setGameState(
        newGameState.status === "OVER" && newGameState.result === "VICTORY"
          ? { ...newGameState, reason: "N_IN_ROW" }
          : newGameState,
      );
      setWinningLineParams(getWinningLineParams(board));
    },
    [moves],
  );

  useEffect(() => {
    const pregameCountdown = pregameCountdownRef.current;
    if (!(gameState.status === "NOT_STARTED" && pregameCountdown)) return;

    pregameCountdown.api?.start();

    return () => {
      pregameCountdown.api?.stop();
    };
  }, [gameState.status]);

  useEffect(() => {
    const timeRemaining: [Player, number][] = [
      ...(Object.entries(
        playersRemainingTime ?? PLAYERS.map((player) => [player, Infinity]),
      ) as Entries<Record<Player, number>>),
      [whoseTurn, timeRemainingToMove ?? Infinity],
    ];

    const playerWithExpiredTime = timeRemaining.find(([, time]) => time <= 0)?.[0];

    if (!playerWithExpiredTime) return;

    stopStopwatch();
    setGameState({
      status: "OVER",
      result: "VICTORY",
      reason: "TIME_IS_UP",
      winner: getOpponent(playerWithExpiredTime),
    });
  }, [playersRemainingTime, timeRemainingToMove, whoseTurn]);

  useEffect(() => {
    if (!(isGameInProgress() && whoseTurn === opponent)) return;

    const { position } = findBestMove(moves, opponent);
    if (!isMoveAllowed(moves, position, opponent)) return;

    let timerId = 0;
    void (async () => {
      await playerIconAnimation.current?.finished;
      timerId = window.setTimeout(() => {
        makeMove(opponent, position);
      }, DELAY_BEFORE_BOT_MOVE);
    })();

    return () => {
      clearTimeout(timerId);
    };
  }, [isGameInProgress, makeMove, moves, opponent, whoseTurn]);

  useLayoutEffect(() => {
    if (moves.length === initialMoves.length) return;

    const { position } = moves.at(-1) ?? {};
    if (!position) return;

    const index = positionToIndex(position);
    const playerIcon = playerIconRefs.current[index];

    if (!playerIcon) return;

    const animation = playerIcon.api.startAnimation();
    if (!animation) return;

    playerIconAnimation.current = animation;
    void animation.finished.then(() => {
      setTimeRemainingToMove(timePerMove);
      startStopwatch();
      playerIconAnimation.current = null;
    });

    return () => {
      animation.cancel();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialMoves.length, moves]);

  const handleGameOver = useCallback(
    (gameState: GameOverState) => {
      setTimeout(() => {
        onGameOver?.(gameState);
      }, onGameOverDelay);
    },
    [onGameOver, onGameOverDelay],
  );

  useLayoutEffect(() => {
    if (gameState.status === "NOT_STARTED" || gameState.status === "IN_PROGRESS") return;

    if (gameState.result === "DRAW" || gameState.reason === "TIME_IS_UP") {
      void (async () => {
        await playerIconAnimation.current?.finished;
        handleGameOver(gameState);
      })();
      return;
    }

    if (!winningLineParams) return;

    const animation = winningLineRef.current?.api.startAnimation();
    if (!animation) return;

    animation.pause();

    void (async () => {
      await playerIconAnimation.current?.finished;
      animation.play();
      await animation.finished;
      handleGameOver(gameState);
    })();

    return () => {
      animation.cancel();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState, winningLineParams]);

  const handleCellClick = (index: number) => {
    if (!(isGameInProgress() && whoseTurn === myPlayer)) return;

    const position = positionFromIndex(index);
    if (!(isMoveAllowed(moves, position, myPlayer) && !playerIconAnimation.current)) return;

    makeMove(myPlayer, position);
  };

  const PROGRESS_BAR_GRADIENT: ColorStop[] = [
    { color: [255, 0, 0], offset: 0 },
    { color: [255, 255, 0], offset: 0.5 },
    { color: [0, 255, 0], offset: 1 },
  ];
  return (
    <div className={cn("overflow-auto", className)} {...props}>
      <div className="flex items-center justify-evenly">
        {
          <Countdown
            {...DEFAULT_COUNTDOWN_PROPS}
            ref={pregameCountdownRef}
            date={gameStartsAt.current}
            onComplete={startGame}
            renderer={({ total }) => (
              <p
                className={cn(
                  "order-2 text-center",
                  gameState.status !== "NOT_STARTED" && "invisible",
                )}
              >
                {tc(TRANSLATION_KEYS.THE_GAME_STARTS_IN_N, {
                  n: toSeconds(total),
                })}
                &nbsp;{t(TRANSLATION_KEYS.S)}
              </p>
            )}
          />
        }
        {Object.entries(playersInfo).map(
          ([player, { firstName, lastName, avatar }], index, { length }) => {
            const fullName = [firstName, lastName].join(SPACE).trim();

            return (
              <div
                key={index}
                style={
                  {
                    "--order": index < length / 2 ? index : index + 1,
                  } as CSSProperties
                }
                className="order-(--order) flex items-center gap-1"
              >
                <UserAvatar
                  firstName={firstName}
                  lastName={lastName}
                  avatar={avatar}
                  className="size-16"
                />
                <div className="flex flex-col gap-1">
                  <span>{fullName || tc(TRANSLATION_KEYS.NAME_NOT_SPECIFIED)}</span>
                  {timePerPlayer && playersRemainingTime && (
                    <div className="relative">
                      <Progress
                        value={asPercentage(playersRemainingTime[player as Player] / timePerPlayer)}
                        style={
                          {
                            "--fill-color": rgb(
                              calculateColorFromGradient(
                                PROGRESS_BAR_GRADIENT,
                                playersRemainingTime[player as Player] / timePerPlayer,
                              ),
                            ),
                          } as CSSProperties
                        }
                        className="h-4 min-w-16 bg-gray-200 [&>*]:bg-(--fill-color)"
                      />
                      <span className="absolute top-1/2 left-1/2 -translate-1/2 text-nowrap text-gray-900">
                        {[
                          toSeconds(playersRemainingTime[player as Player]),
                          t(TRANSLATION_KEYS.S),
                        ].join(SPACE)}
                      </span>
                    </div>
                  )}
                  {typeof timePerMove === "number" && typeof timeRemainingToMove === "number" && (
                    <div className={cn("relative", whoseTurn !== player && "invisible")}>
                      <Progress
                        value={asPercentage(timeRemainingToMove / timePerMove)}
                        style={
                          {
                            "--fill-color": rgb(
                              calculateColorFromGradient(
                                PROGRESS_BAR_GRADIENT,
                                timeRemainingToMove / timePerMove,
                              ),
                            ),
                          } as CSSProperties
                        }
                        className={cn(
                          "h-3 bg-gray-200 [&>*]:bg-(--fill-color) [&>*]:transition-none",
                        )}
                      />
                      <span className="absolute top-1/2 left-1/2 -translate-1/2 text-xs text-nowrap text-gray-900">
                        {[toSeconds(timeRemainingToMove), t(TRANSLATION_KEYS.S)].join(SPACE)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          },
        )}
      </div>
      <div className="bg-primary relative m-auto grid max-w-180 min-w-80 grid-cols-3 gap-1">
        {winningLineParams && (
          <WinningLine
            ref={winningLineRef}
            {...winningLineParams}
            className="absolute size-full p-2"
          />
        )}
        {board.flat().map((maybePlayer, index) => {
          const PlayerIcon = ICONS_BY_PLAYER[maybePlayer];
          return (
            <button
              key={index}
              className="bg-background flex aspect-square items-center justify-center"
              onClick={() => handleCellClick(index)}
            >
              {PlayerIcon && (
                <PlayerIcon
                  ref={(instance) => {
                    playerIconRefs.current[index] = instance;
                  }}
                  className="size-4/5"
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export { ClassicTimeLimitGame };
export type { GameOverState, PlayerInfo, PlayersInfo };
