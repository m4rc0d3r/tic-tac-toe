import type { Player } from "@tic-tac-toe/core";
import { X } from "@tic-tac-toe/core";
import { useState } from "react";

import type { GameOverState } from "./game";
import { ClassicGame } from "./game";
import { ClassicGameOverDialog } from "./game-over-dialog";

function ClassicGamePage() {
  const [gameStartedAt, setGameStartedAt] = useState(Date.now());
  const [gameOverState, setGameOverState] = useState<GameOverState | null>(null);
  const [isGameOverDialogOpen, setIsGameOverDialogOpen] = useState(!!gameOverState);
  const [myPlayer, _setMyPlayer] = useState<Player>(X);

  const handlePlayAgain = () => {
    setGameStartedAt(Date.now());
    setGameOverState(null);
    setIsGameOverDialogOpen(false);
  };

  return (
    <div className="flex-grow overflow-auto">
      <ClassicGame
        key={gameStartedAt}
        myPlayer={myPlayer}
        onGameOver={(gameState) => {
          setGameOverState(gameState);
          setIsGameOverDialogOpen(true);
        }}
      />
      {gameOverState && (
        <ClassicGameOverDialog
          open={isGameOverDialogOpen}
          myPlayer={myPlayer}
          gameOverState={gameOverState}
          onPlayAgain={handlePlayAgain}
        />
      )}
    </div>
  );
}

export { ClassicGamePage };
