import type { ComponentProps, ComponentType, Ref } from "react";

import type { Svg } from "../svg";

type PlayerIconInstanceRef = {
  api: {
    startAnimation: () => Animation | undefined;
  };
};
type PlayerIconProps = Omit<ComponentProps<typeof Svg>, "ref"> & {
  ref?: Ref<PlayerIconInstanceRef> | undefined;
};
type PlayerIcon = ComponentType<PlayerIconProps>;

const DURATION = 500;

export { DURATION };
export type { PlayerIcon, PlayerIconInstanceRef, PlayerIconProps };
