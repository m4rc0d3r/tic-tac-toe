import { DEFAULT_SVG_SIZE, DEFAULT_SVG_STROKE_WIDTH, Svg } from "../svg";

import type { PlayerIcon, PlayerIconProps } from "./shared";

const CENTER = DEFAULT_SVG_SIZE / 2;
const RADIUS = DEFAULT_SVG_SIZE / 2 - DEFAULT_SVG_STROKE_WIDTH;

const NoughtIcon: PlayerIcon = ({ ...props }: PlayerIconProps) => {
  return (
    <Svg {...props}>
      <circle cx={CENTER} cy={CENTER} r={RADIUS} />
    </Svg>
  );
};

export { NoughtIcon };
