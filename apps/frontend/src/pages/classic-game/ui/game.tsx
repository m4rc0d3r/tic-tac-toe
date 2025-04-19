import type { Move, Player } from "@tic-tac-toe/core";
import {
  BOARD_AREA,
  buildBoard,
  findBestMove,
  getOpponent,
  isEven,
  isMoveAllowed,
  O,
  positionFromIndex,
  positionToIndex,
  X,
} from "@tic-tac-toe/core";
import type { ComponentProps } from "react";
import { useEffect, useRef, useState } from "react";

import type { PlayerIcon, PlayerIconInstanceRef } from "~/shared/ui/player-icons";
import { CrossIcon, NoughtIcon } from "~/shared/ui/player-icons";
import { cn } from "~/shared/ui/utils";

const ICONS_BY_PLAYER: Record<string, PlayerIcon> = {
  [X]: CrossIcon,
  [O]: NoughtIcon,
};

type WhoseMoveIsFirst = "I" | "OPPONENT";
type Props = ComponentProps<"div"> & {
  myPlayer?: Player | undefined;
  whoseMoveIsFirst?: WhoseMoveIsFirst | undefined;
  initialMoves?: Move[] | undefined;
  delayBeforeBotMove?: number | undefined;
};

function ClassicGame({
  myPlayer = X,
  whoseMoveIsFirst = "I",
  initialMoves = [],
  delayBeforeBotMove = 1000,
  className,
  ...props
}: Props) {
  const opponent = getOpponent(myPlayer);
  const firstPlayer = whoseMoveIsFirst === "I" ? myPlayer : opponent;

  const [moves, setMoves] = useState<Move[]>(initialMoves);

  const whoseTurn = isEven(moves.length) ? firstPlayer : getOpponent(firstPlayer);
  const board = buildBoard(moves);

  const playerIconRefs = useRef(new Array<PlayerIconInstanceRef | null>(BOARD_AREA).fill(null));
  const playerIconAnimation = useRef<Animation>(null);

  useEffect(() => {
    if (whoseTurn !== opponent) return;

    const { position } = findBestMove(moves, opponent);
    if (!isMoveAllowed(moves, position, opponent)) return;

    const timerId = setTimeout(() => {
      void (async () => {
        if (playerIconAnimation.current) {
          await playerIconAnimation.current.finished;
        }
        setMoves([...moves, { player: opponent, position }]);
      })();
    }, delayBeforeBotMove);

    return () => {
      clearTimeout(timerId);
    };
  }, [delayBeforeBotMove, moves, opponent, whoseTurn]);

  useEffect(() => {
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
  }, [initialMoves.length, moves]);

  const handleCellClick = (index: number) => {
    const position = positionFromIndex(index);
    if (
      !(
        whoseTurn === myPlayer &&
        isMoveAllowed(moves, position, myPlayer) &&
        !playerIconAnimation.current
      )
    )
      return;

    setMoves((prev) => [...prev, { player: myPlayer, position }]);
  };

  return (
    <div className={cn("overflow-auto", className)} {...props}>
      <div className="bg-primary m-auto grid max-w-180 min-w-80 grid-cols-3 gap-1">
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
