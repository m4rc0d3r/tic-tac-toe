import { BOARD_SIZE, EMPTY_STRING, getOpponent, SPACE } from "@tic-tac-toe/core";
import type { ComponentProps } from "react";
import { Fragment, useState } from "react";
import { Link } from "react-router";

import { ClassicGameOptionsDialog } from "./game-options-dialog";
import { MedalIcon } from "./icons";
import type { CompletedGame, GameOptions } from "./shared";
import { convertTimeToSeconds, ICONS_BY_PLAYER } from "./shared";

import { TRANSLATION_KEYS, useTranslation2 } from "~/shared/i18n";
import { toSeconds } from "~/shared/lib/format";
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
import type { PlayerIcon, PlayerIconProps } from "~/shared/ui/player-icons";
import { cn } from "~/shared/ui/utils";

type Props = ComponentProps<typeof Dialog> & {
  nextGameOptions: GameOptions;
  completedGames?: CompletedGame[] | undefined;
  onGameOptionsChange?: ((gameOptions: GameOptions) => void) | undefined;
  onPlayAgain?: (() => void) | undefined;
};

function ClassicGameOverDialog({
  nextGameOptions,
  completedGames = [],
  onGameOptionsChange,
  onPlayAgain,
  ...props
}: Props) {
  const {
    translation: { t },
    postproc: { tc, tsp },
  } = useTranslation2();

  const [isClassicGameOptionsDialogOpen, setIsClassicGameOptionsDialogOpen] = useState(false);

  const lastGame = completedGames.at(-1);

  if (!lastGame) return null;

  const {
    gameOptions: { myPlayerIcon: myPlayer },
    gameOverState: lastGameOverState,
  } = lastGame;

  const [titleTranslationKey, descriptionTranslationKey] =
    lastGameOverState.result === "DRAW"
      ? [TRANSLATION_KEYS.DRAW, TRANSLATION_KEYS.THE_GAME_ENDED_IN_A_DRAW]
      : lastGameOverState.winner === myPlayer
        ? [TRANSLATION_KEYS.VICTORY, TRANSLATION_KEYS.YOU_WON]
        : [TRANSLATION_KEYS.DEFEAT, TRANSLATION_KEYS.YOU_LOST];

  const MyPlayerIcon = ICONS_BY_PLAYER[nextGameOptions.myPlayerIcon];

  const STROKE_WIDTH = 8;

  return (
    <Dialog {...props}>
      <DialogContent withCross={false} className="max-h-9/10 overflow-auto">
        <DialogHeader>
          <DialogTitle>{tc(titleTranslationKey)}</DialogTitle>
          <DialogDescription>{tsp(descriptionTranslationKey)}</DialogDescription>
        </DialogHeader>
        <div>
          <h3 className="text-center font-medium">
            {tc(TRANSLATION_KEYS.HISTORY_OF_COMPLETED_GAMES)}
          </h3>
          <div className="grid grid-cols-5 place-items-center">
            {[
              tc(TRANSLATION_KEYS.I),
              tc(TRANSLATION_KEYS.OPPONENT),
              tc(TRANSLATION_KEYS.MOVES_FIRST),
              tc(TRANSLATION_KEYS.RESULT),
              tc(TRANSLATION_KEYS.DURATION),
            ].map((value, index) => (
              <span key={index} className="text-center">
                {value}
              </span>
            ))}
            {completedGames.map(
              ({
                gameOptions: { myPlayerIcon, whoMakesFirstMove },
                gameOverState,
                startedAt,
                endedAt,
              }) => {
                const { result } = gameOverState;

                return (
                  <Fragment key={startedAt.getTime()}>
                    {[myPlayerIcon, getOpponent(myPlayerIcon)].map((player, index) => {
                      const PlayerIcon = ICONS_BY_PLAYER[player];
                      return (
                        <span key={index}>
                          {PlayerIcon &&
                            (result === "VICTORY" ? (
                              <PlayerIconWithMedal
                                PlayerIcon={PlayerIcon}
                                medalMetal={gameOverState.winner === player ? "GOLD" : "SILVER"}
                                playerIconProps={{
                                  strokeWidth: STROKE_WIDTH,
                                }}
                                className="size-9"
                              />
                            ) : (
                              <PlayerIcon strokeWidth={STROKE_WIDTH} className="size-6" />
                            ))}
                        </span>
                      );
                    })}
                    {[
                      tc(TRANSLATION_KEYS[whoMakesFirstMove]),
                      tc(
                        TRANSLATION_KEYS[
                          result === "VICTORY"
                            ? gameOverState.winner === myPlayerIcon
                              ? result
                              : "DEFEAT"
                            : result
                        ],
                      ) +
                        (result === "VICTORY"
                          ? ` (${t(
                              TRANSLATION_KEYS[
                                gameOverState.reason === "N_IN_ROW"
                                  ? "N_IN_A_ROW"
                                  : gameOverState.reason
                              ],
                              {
                                n: BOARD_SIZE,
                              },
                            )})`
                          : EMPTY_STRING),
                      [
                        toSeconds(endedAt.getTime() - startedAt.getTime()),
                        t(TRANSLATION_KEYS.S),
                      ].join(SPACE),
                    ].map((value, index) => (
                      <span key={index} className="text-center">
                        {value}
                      </span>
                    ))}
                  </Fragment>
                );
              },
            )}
          </div>
        </div>
        <div className="flex flex-col">
          <h3 className="text-center font-medium">{tc(TRANSLATION_KEYS.NEXT_GAME_PARAMETERS)}</h3>
          <p className="flex items-center">
            {tc(TRANSLATION_KEYS.MY_PLAYER_ICON)}:&nbsp;
            {MyPlayerIcon && <MyPlayerIcon strokeWidth={STROKE_WIDTH} className="size-6" />}
          </p>
          <p>
            {tc(TRANSLATION_KEYS.WHO_MAKES_THE_FIRST_MOVE)}:&nbsp;
            {tc(TRANSLATION_KEYS[nextGameOptions.whoMakesFirstMove])}
          </p>
          {typeof nextGameOptions.timePerMove === "number" && (
            <p>
              {tc(TRANSLATION_KEYS.TIME_PER_MOVE)}:&nbsp;
              {[toSeconds(nextGameOptions.timePerMove), t(TRANSLATION_KEYS.S)].join(SPACE)}
            </p>
          )}
          {typeof nextGameOptions.timePerPlayer === "number" && (
            <p>
              {tc(TRANSLATION_KEYS.TIME_PER_PLAYER)}:&nbsp;
              {[toSeconds(nextGameOptions.timePerPlayer), t(TRANSLATION_KEYS.S)].join(SPACE)}
            </p>
          )}
          <ClassicGameOptionsDialog
            open={isClassicGameOptionsDialogOpen}
            onOpenChange={setIsClassicGameOptionsDialogOpen}
            title={tc(TRANSLATION_KEYS.CHANGING_GAME_SETTINGS)}
            okButtonTitle={tc(TRANSLATION_KEYS.APPLY)}
            trigger={
              <Button variant="outline" className="self-end">
                {tc(TRANSLATION_KEYS.CHANGE)}
              </Button>
            }
            initialValues={{
              ...nextGameOptions,
              ...convertTimeToSeconds(nextGameOptions),
            }}
            onSubmit={(options) => {
              onGameOptionsChange?.(options);
              setIsClassicGameOptionsDialogOpen(false);
            }}
          />
        </div>
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
type PlayerIconWithMedalProps = ComponentProps<"div"> & {
  PlayerIcon: PlayerIcon;
  medalMetal: MedalMetal;
  playerIconProps?: PlayerIconProps | undefined;
};

function PlayerIconWithMedal({
  PlayerIcon,
  medalMetal,
  playerIconProps: { className: playerIconClassName, ...playerIconProps } = {},
  className,
  ...props
}: PlayerIconWithMedalProps) {
  return (
    <div className={cn("relative h-24 w-16", className)} {...props}>
      <PlayerIcon
        className={cn("absolute h-2/3 w-full", playerIconClassName)}
        {...playerIconProps}
      />
      <MedalIcon metal={medalMetal} className="absolute top-1/3 h-2/3 w-full" />
    </div>
  );
}

export { ClassicGameOverDialog };
