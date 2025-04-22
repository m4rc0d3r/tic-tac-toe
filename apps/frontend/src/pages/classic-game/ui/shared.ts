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

export { ICONS_BY_PLAYER, zGameOptions };
export type { GameOptions };
