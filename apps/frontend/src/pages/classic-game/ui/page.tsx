import { X } from "@tic-tac-toe/core";
import type { ComponentProps } from "react";
import { useState } from "react";
import { useLocation } from "react-router";

import type { GameOverState } from "./game";
import { ClassicGameOverDialog } from "./game-over-dialog";
import type { GameOptions } from "./shared";
import { zGameOptions } from "./shared";
import { ClassicTimeLimitGame } from "./time-limit-game";

import { usePreviousValue } from "~/shared/lib/react";
import { cn } from "~/shared/ui/utils";

const DEFAULT_GAME_OPTIONS: GameOptions = {
  myPlayerIcon: X,
  whoMakesFirstMove: "I",
};

function getDefaultState(gameOptions: GameOptions) {
  const gameOverState = null;
  return {
    gameStartedAt: Date.now(),
    gameOverState,
    isGameOverDialogOpen: !!gameOverState,
    gameOptions,
  };
}

type Props = ComponentProps<"div"> & {};

function ClassicGamePage({ className, ...props }: Props) {
  const location = useLocation();

  const gameOptionsFromRouter = zGameOptions.safeParse(location.state);
  const initialGameOptions = {
    ...DEFAULT_GAME_OPTIONS,
    ...gameOptionsFromRouter.data,
  };

  const resetState = (gameOptions: GameOptions) => {
    const DEFAULT_STATE = getDefaultState(gameOptions);
    setGameStartedAt(DEFAULT_STATE.gameStartedAt);
    setGameOverState(DEFAULT_STATE.gameOverState);
    setIsGameOverDialogOpen(DEFAULT_STATE.isGameOverDialogOpen);
    setGameOptions(DEFAULT_STATE.gameOptions);
  };

  const DEFAULT_STATE = getDefaultState(initialGameOptions);

  const [gameStartedAt, setGameStartedAt] = useState(DEFAULT_STATE.gameStartedAt);
  const [gameOverState, setGameOverState] = useState<GameOverState | null>(
    DEFAULT_STATE.gameOverState,
  );
  const [isGameOverDialogOpen, setIsGameOverDialogOpen] = useState(
    DEFAULT_STATE.isGameOverDialogOpen,
  );
  const [gameOptions, setGameOptions] = useState(DEFAULT_STATE.gameOptions);

  const handlePlayAgain = () => {
    resetState(gameOptions);
  };

  const previousLocationKey = usePreviousValue(location.key);

  if (previousLocationKey && previousLocationKey !== location.key) {
    resetState(initialGameOptions);
    return;
  }

  return (
    <div className={cn("flex-grow overflow-auto", className)} {...props}>
      <ClassicTimeLimitGame
        key={gameStartedAt}
        myPlayer={gameOptions.myPlayerIcon}
        whoseMoveIsFirst={gameOptions.whoMakesFirstMove}
        timePerMove={3000}
        timePerPlayer={30000}
        onGameOver={(gameState) => {
          setGameOverState(gameState);
          setIsGameOverDialogOpen(true);
        }}
      />
      {gameOverState && (
        <ClassicGameOverDialog
          open={isGameOverDialogOpen}
          myPlayer={gameOptions.myPlayerIcon}
          gameOverState={gameOverState}
          gameOptions={gameOptions}
          onGameOptionsChange={setGameOptions}
          onPlayAgain={handlePlayAgain}
        />
      )}
    </div>
  );
}

export { ClassicGamePage };
