import type { RgbLike } from "@tic-tac-toe/core";
import { RGB_SIZE, SPACE } from "@tic-tac-toe/core";

function rgb(color: RgbLike) {
  const alpha = color[3];
  return `rgb(${color.slice(0, RGB_SIZE).join(SPACE)}${typeof alpha === "number" ? ` / ${alpha}` : ""})`;
}

export { rgb };
