import { getOpponent } from "@tic-tac-toe/core";
import type { ComponentProps } from "react";
import { useState } from "react";
import { useLocation } from "react-router";

import { ClassicGameOverDialog } from "./game-over-dialog";
import type { CompletedGame, GameOptions } from "./shared";
import { DEFAULT_GAME_OPTIONS, zGameOptions } from "./shared";
import type { PlayersInfo } from "./time-limit-game";
import { ClassicTimeLimitGame } from "./time-limit-game";

import { useAuthStore } from "~/entities/auth";
import anonymousImage from "~/shared/assets/anonymous.png";
import robotImage from "~/shared/assets/robot.png";
import { usePreviousValue } from "~/shared/lib/react";
import { cn } from "~/shared/ui/utils";

function getDefaultState(gameOptions: GameOptions) {
  return {
    gameStartedAt: new Date(),
    isGameOverDialogOpen: false,
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
    setIsGameOverDialogOpen(DEFAULT_STATE.isGameOverDialogOpen);
    setGameOptions(DEFAULT_STATE.gameOptions);
  };

  const DEFAULT_STATE = getDefaultState(initialGameOptions);

  const [gameStartedAt, setGameStartedAt] = useState(DEFAULT_STATE.gameStartedAt);
  const [isGameOverDialogOpen, setIsGameOverDialogOpen] = useState(
    DEFAULT_STATE.isGameOverDialogOpen,
  );
  const [gameOptions, setGameOptions] = useState(DEFAULT_STATE.gameOptions);
  const [completedGames, setCompletedGames] = useState<CompletedGame[]>([]);

  const playersInfo = {
    [gameOptions.myPlayerIcon]: useAuthStore.use.me() ?? {
      firstName: "Anonymous",
      lastName: "",
      avatar: anonymousImage,
    },
    [getOpponent(gameOptions.myPlayerIcon)]: {
      firstName: "Bot",
      lastName: "",
      avatar: robotImage,
    },
  } as PlayersInfo;

  const handlePlayAgain = () => {
    resetState(gameOptions);
  };

  const previousLocationKey = usePreviousValue(location.key);

  if (previousLocationKey && previousLocationKey !== location.key) {
    resetState(initialGameOptions);
    return;
  }

  const handleGameOver: ComponentProps<typeof ClassicTimeLimitGame>["onGameOver"] = (gameState) => {
    setCompletedGames((prev) => [
      ...prev,
      {
        gameOptions,
        gameOverState: gameState,
        startedAt: gameStartedAt,
        endedAt: new Date(),
      },
    ]);
    setIsGameOverDialogOpen(true);
  };

  return (
    <div className={cn("flex-grow overflow-auto", className)} {...props}>
      <ClassicTimeLimitGame
        key={gameStartedAt.getTime()}
        playersInfo={playersInfo}
        myPlayer={gameOptions.myPlayerIcon}
        whoseMoveIsFirst={gameOptions.whoMakesFirstMove}
        timePerMove={gameOptions.timePerMove}
        timePerPlayer={gameOptions.timePerPlayer}
        onGameOver={handleGameOver}
      />
      <ClassicGameOverDialog
        open={isGameOverDialogOpen}
        nextGameOptions={gameOptions}
        completedGames={completedGames}
        onGameOptionsChange={setGameOptions}
        onPlayAgain={handlePlayAgain}
      />
    </div>
  );
}

export { ClassicGamePage };
