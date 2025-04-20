import type { GameState, Move, Player, Vec2, WinningLineParams } from "@tic-tac-toe/core";
import {
  BOARD_AREA,
  buildBoard,
  findBestMove,
  getGameState,
  getOpponent,
  getWinningLineParams,
  isEven,
  isMoveAllowed,
  positionFromIndex,
  positionToIndex,
  X,
} from "@tic-tac-toe/core";
import type { ComponentProps } from "react";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

import { ICONS_BY_PLAYER } from "./shared";
import type { WinningLineInstanceRef } from "./winning-line";
import { WinningLine } from "./winning-line";

import type { PlayerIconInstanceRef } from "~/shared/ui/player-icons";
import { cn } from "~/shared/ui/utils";

type WhoseMoveIsFirst = "I" | "OPPONENT";
type GameOverState = Extract<GameState, { status: "OVER" }>;
type Props = ComponentProps<"div"> & {
  myPlayer?: Player | undefined;
  whoseMoveIsFirst?: WhoseMoveIsFirst | undefined;
  initialMoves?: Move[] | undefined;
  delayBeforeBotMove?: number | undefined;
  onGameOver?: ((gameState: GameOverState) => void) | undefined;
  onGameOverDelay?: number | undefined;
};

function ClassicGame({
  myPlayer = X,
  whoseMoveIsFirst = "I",
  initialMoves = [
    { player: "X", position: { x: 2, y: 0 } },
    { player: "O", position: { x: 1, y: 1 } },
    { player: "X", position: { x: 0, y: 0 } },
    { player: "O", position: { x: 1, y: 0 } },
    { player: "X", position: { x: 1, y: 2 } },
    { player: "O", position: { x: 0, y: 1 } },
    { player: "X", position: { x: 0, y: 2 } },
  ],
  delayBeforeBotMove = 1000,
  className,
  onGameOver,
  onGameOverDelay = 100,
  ...props
}: Props) {
  const opponent = getOpponent(myPlayer);
  const firstPlayer = whoseMoveIsFirst === "I" ? myPlayer : opponent;

  const [moves, setMoves] = useState<Move[]>(initialMoves);
  const [gameState, setGameState] = useState<GameState>({ status: "IN_PROGRESS" });
  const [winningLineParams, setWinningLineParams] = useState<WinningLineParams | null>(null);
  const winningLineRef = useRef<WinningLineInstanceRef>(null);

  const whoseTurn = isEven(moves.length) ? firstPlayer : getOpponent(firstPlayer);
  const board = buildBoard(moves);

  const playerIconRefs = useRef(new Array<PlayerIconInstanceRef | null>(BOARD_AREA).fill(null));
  const playerIconAnimation = useRef<Animation>(null);

  const isGameInProgress = useCallback(
    () => gameState.status === "IN_PROGRESS",
    [gameState.status],
  );

  const makeMove = useCallback(
    (player: Player, position: Vec2) => {
      const newMoves = [...moves, { player, position }];
      const board = buildBoard(newMoves);
      setMoves(newMoves);
      setGameState(getGameState(board));
      setWinningLineParams(getWinningLineParams(board));
    },
    [moves],
  );

  useEffect(() => {
    if (isGameInProgress() && whoseTurn !== opponent) return;

    const { position } = findBestMove(moves, opponent);
    if (!isMoveAllowed(moves, position, opponent)) return;

    const timerId = setTimeout(() => {
      void (async () => {
        if (playerIconAnimation.current) {
          await playerIconAnimation.current.finished;
        }
        makeMove(opponent, position);
      })();
    }, delayBeforeBotMove);

    return () => {
      clearTimeout(timerId);
    };
  }, [delayBeforeBotMove, isGameInProgress, makeMove, moves, opponent, whoseTurn]);

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
      playerIconAnimation.current = null;
    });

    return () => {
      animation.cancel();
    };
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
    if (gameState.status === "IN_PROGRESS") return;

    if (gameState.result === "DRAW") {
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

  return (
    <div className={cn("overflow-auto", className)} {...props}>
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

export { ClassicGame };
export type { GameOverState };
