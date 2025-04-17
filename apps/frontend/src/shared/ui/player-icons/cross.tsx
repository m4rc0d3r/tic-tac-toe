import { COMMA, SPACE } from "@tic-tac-toe/core";
import { useImperativeHandle, useRef } from "react";

import { DEFAULT_SVG_SIZE, Svg } from "../svg";

import type { PlayerIcon, PlayerIconProps } from "./shared";
import { DURATION } from "./shared";

const M = "M";
const L = "L";

const START = 0;
const END = DEFAULT_SVG_SIZE;

type Command = [string, number, number];

const D = commandsToString([
  [M, START, START],
  [L, END, END],
  [M, END, START],
  [L, START, END],
]);

const HALF_OFFSET = 0.5;

const ANIMATION = [
  [
    {
      d: path(
        commandsToString([
          [M, START, START],
          [L, START, START],
        ]),
      ),
    },
    {
      d: path(
        commandsToString([
          [M, START, START],
          [L, END, END],
        ]),
      ),
      easing: "steps(1)",
      offset: HALF_OFFSET - Number.EPSILON,
    },
    {
      d: path(
        commandsToString([
          [M, START, START],
          [L, END, END],
          [M, END, START],
          [L, END, START],
        ]),
      ),
      offset: HALF_OFFSET + Number.EPSILON,
    },
    {
      d: path(D),
    },
  ],
  {
    duration: DURATION,
  },
] satisfies Parameters<Element["animate"]>;

const CrossIcon: PlayerIcon = ({ ref, ...props }: PlayerIconProps) => {
  const pathRef = useRef<SVGPathElement>(null);

  useImperativeHandle(ref, () => {
    return {
      api: {
        startAnimation: () => {
          return pathRef.current?.animate(...ANIMATION);
        },
      },
    };
  }, []);

  return (
    <Svg {...props}>
      <path ref={pathRef} d={D}></path>
    </Svg>
  );
};

function commandToString(command: Command) {
  return `${command[0]} ${command.slice(1).join(COMMA)}`;
}

function commandsToString(commands: Command[]) {
  return commands.map(commandToString).join(SPACE);
}

function path(commands: string) {
  return `path("${commands}")`;
}

export { CrossIcon };
