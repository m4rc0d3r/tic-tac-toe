import type { Player } from "@tic-tac-toe/core";
import { getOpponent } from "@tic-tac-toe/core";
import type { ComponentProps } from "react";
import { Link } from "react-router";

import type { GameOverState } from "./game";
import { MedalIcon } from "./icons";
import { ICONS_BY_PLAYER } from "./shared";

import { TRANSLATION_KEYS, useTranslation2 } from "~/shared/i18n";
import { ROUTES } from "~/shared/routing";
import { Button } from "~/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/shared/ui/dialog";
import type { PlayerIcon } from "~/shared/ui/player-icons";
import { CrossIcon, NoughtIcon } from "~/shared/ui/player-icons";
import { cn } from "~/shared/ui/utils";

type Props = ComponentProps<typeof Dialog> & {
  myPlayer: Player;
  gameOverState: GameOverState;
  onPlayAgain?: (() => void) | undefined;
};

function ClassicGameOverDialog({ myPlayer, gameOverState, onPlayAgain, ...props }: Props) {
  const {
    postproc: { tc, tsp },
  } = useTranslation2();

  const [titleTranslationKey, descriptionTranslationKey] =
    gameOverState.result === "DRAW"
      ? [TRANSLATION_KEYS.DRAW, TRANSLATION_KEYS.THE_GAME_ENDED_IN_A_DRAW]
      : gameOverState.winner === myPlayer
        ? [TRANSLATION_KEYS.VICTORY, TRANSLATION_KEYS.YOU_WON]
        : [TRANSLATION_KEYS.DEFEAT, TRANSLATION_KEYS.YOU_LOST];

  return (
    <Dialog {...props}>
      <DialogContent withCross={false} className="overflow-auto">
        <DialogHeader>
          <DialogTitle>{tc(titleTranslationKey)}</DialogTitle>
          <DialogDescription>{tsp(descriptionTranslationKey)}</DialogDescription>
        </DialogHeader>
        <PlayerIconsWithMedals gameOverState={gameOverState} />
        <DialogFooter>
          <div className="xs:flex-row flex flex-col justify-end gap-2">
            <Button asChild type="button" variant="secondary">
              <Link to={ROUTES.home}>{tc(TRANSLATION_KEYS.GO_TO_THE_MAIN_PAGE)}</Link>
            </Button>
            <Button onClick={onPlayAgain}>{tc(TRANSLATION_KEYS.PLAY_AGAIN)}</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

type MedalMetal = ComponentProps<typeof MedalIcon>["metal"];

type PlayerIconsWithMedalsProps = ComponentProps<"div"> & {
  gameOverState: GameOverState;
};

function PlayerIconsWithMedals({ gameOverState, className, ...props }: PlayerIconsWithMedalsProps) {
  if (gameOverState.result === "DRAW") {
    return (
      <div className={cn("flex items-center justify-evenly", className)} {...props}>
        <CrossIcon className="size-16" />
        <div>
          <MedalIcon metal="GOLD" className="size-16" />
          <MedalIcon metal="SILVER" className="size-16" />
        </div>
        <NoughtIcon className="size-16" />
      </div>
    );
  }

  const winner = gameOverState.result === "VICTORY" ? gameOverState.winner : "";

  const playerIcons: {
    icon: PlayerIcon | undefined;
    medalMetal: MedalMetal;
  }[] = [
    { icon: ICONS_BY_PLAYER[winner], medalMetal: "GOLD" },
    { icon: winner ? ICONS_BY_PLAYER[getOpponent(winner)] : undefined, medalMetal: "SILVER" },
  ];

  return (
    <div className={cn("flex justify-evenly", className)} {...props}>
      {playerIcons.map(
        ({ icon: PlayerIcon, medalMetal }, index) =>
          PlayerIcon && (
            <div key={index} className="relative h-24 w-16">
              <PlayerIcon className="absolute h-2/3 w-full" />
              <MedalIcon metal={medalMetal} className="absolute top-1/3 h-2/3 w-full" />
            </div>
          ),
      )}
    </div>
  );
}

export { ClassicGameOverDialog };
