import { O, X } from "@tic-tac-toe/core";

import type { PlayerIcon } from "~/shared/ui/player-icons";
import { CrossIcon, NoughtIcon } from "~/shared/ui/player-icons";

const ICONS_BY_PLAYER: Record<string, PlayerIcon> = {
  [X]: CrossIcon,
  [O]: NoughtIcon,
};

export { ICONS_BY_PLAYER };
