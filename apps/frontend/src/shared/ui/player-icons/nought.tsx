import { circumference } from "@tic-tac-toe/core";
import { useImperativeHandle, useRef } from "react";

import { DEFAULT_SVG_SIZE, DEFAULT_SVG_STROKE_WIDTH, Svg } from "../svg";

import type { PlayerIcon, PlayerIconProps } from "./shared";
import { DURATION } from "./shared";

function defineAnimation(circumference: number) {
  return [
    [{ strokeDashoffset: circumference }, { strokeDashoffset: 0 }],
    { duration: DURATION },
  ] satisfies Parameters<Element["animate"]>;
}

const NoughtIcon: PlayerIcon = ({
  ref,
  width = DEFAULT_SVG_SIZE,
  height = DEFAULT_SVG_SIZE,
  strokeWidth = DEFAULT_SVG_STROKE_WIDTH,
  ...props
}: PlayerIconProps) => {
  const circleRef = useRef<SVGCircleElement>(null);

  const widthAsNumber = Number(width);
  const heightAsNumber = Number(height);
  const strokeWidthAsNumber = Number(strokeWidth);

  const radius = Math.min(widthAsNumber, heightAsNumber) / 2 - strokeWidthAsNumber;
  const length = circumference(radius);

  useImperativeHandle(ref, () => {
    return {
      api: {
        startAnimation: () => {
          return circleRef.current?.animate(...defineAnimation(length));
        },
      },
    };
  }, [length]);

  return (
    <Svg width={width} height={height} strokeWidth={strokeWidth} {...props}>
      <circle
        ref={circleRef}
        cx={widthAsNumber / 2}
        cy={heightAsNumber / 2}
        r={radius}
        strokeDasharray={length}
      />
    </Svg>
  );
};

export { NoughtIcon };
