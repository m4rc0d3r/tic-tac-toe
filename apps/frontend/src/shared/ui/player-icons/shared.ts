import type { ComponentProps, ComponentType } from "react";

import type { Svg } from "../svg";

type PlayerIconProps = ComponentProps<typeof Svg>;
type PlayerIcon = ComponentType<PlayerIconProps>;

export type { PlayerIcon, PlayerIconProps };
