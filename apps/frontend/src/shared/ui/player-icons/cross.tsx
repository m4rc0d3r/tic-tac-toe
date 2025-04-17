import { COMMA, SPACE } from "@tic-tac-toe/core";

import { DEFAULT_SVG_SIZE, Svg } from "../svg";

import type { PlayerIcon, PlayerIconProps } from "./shared";

const M = "M";
const L = "L";

const START = 0;
const END = DEFAULT_SVG_SIZE;

const D = [
  [M, START, START],
  [L, END, END],
  [M, END, START],
  [L, START, END],
]
  .map((command) => `${command[0]} ${command.slice(1).join(COMMA)}`)
  .join(SPACE);

const CrossIcon: PlayerIcon = ({ ...props }: PlayerIconProps) => {
  return (
    <Svg {...props}>
      <path d={D}></path>
    </Svg>
  );
};

export { CrossIcon };
