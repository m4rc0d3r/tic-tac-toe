import type { GameState } from "@tic-tac-toe/core";
import { BOARD_AREA, MILLISECONDS_PER_SECOND, O, PLAYERS, X } from "@tic-tac-toe/core";
import { z } from "zod";

import type { PlayerIcon } from "~/shared/ui/player-icons";
import { CrossIcon, NoughtIcon } from "~/shared/ui/player-icons";

const ICONS_BY_PLAYER: Record<string, PlayerIcon> = {
  [X]: CrossIcon,
  [O]: NoughtIcon,
};

const MINIMUM_TIME_PER_MOVE = 2 * MILLISECONDS_PER_SECOND;
const MAXIMUM_TIME_PER_MOVE = 60 * MILLISECONDS_PER_SECOND;
const MINIMUM_TIME_PER_PLAYER = MINIMUM_TIME_PER_MOVE * BOARD_AREA;
const MAXIMUM_TIME_PER_PLAYER = MAXIMUM_TIME_PER_MOVE * BOARD_AREA;

const zGameOptions = z.object({
  myPlayerIcon: z.enum(PLAYERS),
  whoMakesFirstMove: z.enum(["I", "OPPONENT"]),
  timePerMove: z.number().int().min(MINIMUM_TIME_PER_MOVE).max(MAXIMUM_TIME_PER_MOVE).optional(),
  timePerPlayer: z
    .number()
    .int()
    .min(MINIMUM_TIME_PER_PLAYER)
    .max(MAXIMUM_TIME_PER_PLAYER)
    .optional(),
});
type GameOptions = z.infer<typeof zGameOptions>;

const DEFAULT_GAME_OPTIONS: GameOptions = {
  myPlayerIcon: X,
  whoMakesFirstMove: "I",
  timePerMove: MINIMUM_TIME_PER_MOVE,
  timePerPlayer: MINIMUM_TIME_PER_PLAYER,
};

function convertTimeToSeconds(gameOptions: Pick<GameOptions, "timePerMove" | "timePerPlayer">) {
  return {
    ...(gameOptions.timePerMove && {
      timePerMove: gameOptions.timePerMove / MILLISECONDS_PER_SECOND,
    }),
    ...(gameOptions.timePerPlayer && {
      timePerPlayer: gameOptions.timePerPlayer / MILLISECONDS_PER_SECOND,
    }),
  };
}

type GameState2 =
  | {
      status: "NOT_STARTED";
    }
  | Exclude<GameState, { result: "VICTORY" }>
  | (Extract<GameState, { result: "VICTORY" }> & {
      reason: "N_IN_ROW" | "TIME_IS_UP";
    });
type GameOverState = Extract<GameState2, { status: "OVER" }>;

type CompletedGame = {
  gameOptions: GameOptions;
  gameOverState: GameOverState;
  startedAt: Date;
  endedAt: Date;
};

export {
  convertTimeToSeconds,
  DEFAULT_GAME_OPTIONS,
  ICONS_BY_PLAYER,
  MAXIMUM_TIME_PER_MOVE,
  MAXIMUM_TIME_PER_PLAYER,
  MINIMUM_TIME_PER_MOVE,
  MINIMUM_TIME_PER_PLAYER,
  zGameOptions,
};
export type { CompletedGame, GameOptions, GameOverState, GameState2 };
