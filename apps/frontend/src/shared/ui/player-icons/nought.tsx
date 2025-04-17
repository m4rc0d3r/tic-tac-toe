import { circumference } from "@tic-tac-toe/core";
import { useImperativeHandle, useRef } from "react";

import { DEFAULT_SVG_SIZE, DEFAULT_SVG_STROKE_WIDTH, Svg } from "../svg";

import type { PlayerIcon, PlayerIconProps } from "./shared";
import { DURATION } from "./shared";

const CENTER = DEFAULT_SVG_SIZE / 2;
const RADIUS = DEFAULT_SVG_SIZE / 2 - DEFAULT_SVG_STROKE_WIDTH;
const CIRCUMFERENCE = circumference(RADIUS);

const ANIMATION = [
  [{ strokeDashoffset: CIRCUMFERENCE }, { strokeDashoffset: 0 }],
  { duration: DURATION },
] satisfies Parameters<Element["animate"]>;

const NoughtIcon: PlayerIcon = ({ ref, ...props }: PlayerIconProps) => {
  const circleRef = useRef<SVGCircleElement>(null);

  useImperativeHandle(ref, () => {
    return {
      api: {
        startAnimation: () => {
          return circleRef.current?.animate(...ANIMATION);
        },
      },
    };
  }, []);

  return (
    <Svg {...props}>
      <circle ref={circleRef} cx={CENTER} cy={CENTER} r={RADIUS} strokeDasharray={CIRCUMFERENCE} />
    </Svg>
  );
};

export { NoughtIcon };
