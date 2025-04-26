import type { GameState } from "@tic-tac-toe/core";
import { O, PLAYERS, X } from "@tic-tac-toe/core";
import { z } from "zod";

import type { PlayerIcon } from "~/shared/ui/player-icons";
import { CrossIcon, NoughtIcon } from "~/shared/ui/player-icons";

const ICONS_BY_PLAYER: Record<string, PlayerIcon> = {
  [X]: CrossIcon,
  [O]: NoughtIcon,
};

const zGameOptions = z.object({
  myPlayerIcon: z.enum(PLAYERS),
  whoMakesFirstMove: z.enum(["I", "OPPONENT"]),
});
type GameOptions = z.infer<typeof zGameOptions>;

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

export { ICONS_BY_PLAYER, zGameOptions };
export type { CompletedGame, GameOptions, GameOverState, GameState2 };
