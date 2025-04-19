import { BOARD_SIZE, distanceBetweenPoints } from "@tic-tac-toe/core";
import type { ComponentProps, Ref } from "react";
import { useImperativeHandle, useRef } from "react";

import { DURATION } from "~/shared/ui/player-icons";
import { DEFAULT_SVG_SIZE, Svg } from "~/shared/ui/svg";

const START = 0;
const END = DEFAULT_SVG_SIZE;

type LineParams = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
};
function getLineParams(direction: Direction, index: number): LineParams {
  const STEP = (END - START) / BOARD_SIZE;

  if (direction === "DIAGONAL") {
    if (index === 0) {
      return {
        x1: START,
        y1: START,
        x2: END,
        y2: END,
      };
    } else if (index === 1) {
      return {
        x1: END,
        y1: START,
        x2: START,
        y2: END,
      };
    }
  } else if (
    (["HORIZONTAL", "VERTICAL"] satisfies Direction[]).includes(direction) &&
    index >= 0 &&
    index <= 2
  ) {
    const STATIC_COORD = STEP * index + STEP / 2;
    return direction === "HORIZONTAL"
      ? {
          x1: START,
          y1: STATIC_COORD,
          x2: END,
          y2: STATIC_COORD,
        }
      : {
          x1: STATIC_COORD,
          y1: START,
          x2: STATIC_COORD,
          y2: END,
        };
  }

  return {
    x1: 0,
    y1: 0,
    x2: 0,
    y2: 0,
  };
}

function defineAnimationParams(length: number) {
  return [
    [{ strokeDashoffset: length }, { strokeDashoffset: 0 }],
    { duration: DURATION },
  ] satisfies Parameters<Element["animate"]>;
}

type WinningLineInstanceRef = {
  api: {
    startAnimation: () => Animation | undefined;
  };
};
type Direction = "VERTICAL" | "HORIZONTAL" | "DIAGONAL";
type Props = Omit<ComponentProps<typeof Svg>, "ref"> & {
  ref?: Ref<WinningLineInstanceRef> | undefined;

  direction: Direction;
  index: number;
};

function WinningLine({ ref, direction, index, ...props }: Props) {
  const lineRef = useRef<SVGLineElement>(null);

  const { x1, y1, x2, y2 } = getLineParams(direction, index);
  const length = distanceBetweenPoints({ x: x1, y: y1 }, { x: x2, y: y2 });
  const animation = defineAnimationParams(length);

  useImperativeHandle(ref, () => {
    return {
      api: {
        startAnimation: () => {
          return lineRef.current?.animate(...animation);
        },
      },
    };
  }, [animation]);

  return (
    <Svg {...props}>
      <line ref={lineRef} x1={0} y1={0} x2={0} y2={0} />
    </Svg>
  );
}

export { WinningLine };
