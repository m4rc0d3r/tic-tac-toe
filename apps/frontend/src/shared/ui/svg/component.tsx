import { SPACE } from "@tic-tac-toe/core";
import type { ComponentProps } from "react";

import {
  DEFAULT_SVG_FILL,
  DEFAULT_SVG_SIZE,
  DEFAULT_SVG_STROKE,
  DEFAULT_SVG_STROKE_LINECAP,
  DEFAULT_SVG_STROKE_LINEJOIN,
  DEFAULT_SVG_STROKE_WIDTH,
  DEFAULT_SVG_VIEW_BOX,
  DEFAULT_SVG_XMLNS,
} from "./constants";

function Svg({
  xmlns = DEFAULT_SVG_XMLNS,
  width = DEFAULT_SVG_SIZE,
  height = DEFAULT_SVG_SIZE,
  viewBox = Object.values(DEFAULT_SVG_VIEW_BOX).join(SPACE),
  fill = DEFAULT_SVG_FILL,
  stroke = DEFAULT_SVG_STROKE,
  strokeWidth = DEFAULT_SVG_STROKE_WIDTH,
  strokeLinecap = DEFAULT_SVG_STROKE_LINECAP,
  strokeLinejoin = DEFAULT_SVG_STROKE_LINEJOIN,
  className,
  children,
  ...props
}: ComponentProps<"svg">) {
  return (
    <svg
      xmlns={xmlns}
      width={width}
      height={height}
      viewBox={viewBox}
      fill={fill}
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeLinecap={strokeLinecap}
      strokeLinejoin={strokeLinejoin}
      className={className}
      {...props}
    >
      {children}
    </svg>
  );
}

export { Svg };
