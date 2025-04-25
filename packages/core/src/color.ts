import type { ReadonlyTuple } from "type-fest";

import { toArrayWindows } from "./array";
import { lerp } from "./geometry";

type Rgb = ReadonlyTuple<number, typeof RGB_SIZE>;
type Rgba = ReadonlyTuple<number, typeof RGBA_SIZE>;
type RgbLike = Rgb | Rgba;

type ColorStop = {
  color: RgbLike;
  offset: number;
};

const RGB_SIZE = 3;
const RGBA_SIZE = 4;
const MINIMUM_RGB_COMPONENT = 0;
const MAXIMUM_RGB_COMPONENT = 255;
const MINIMUM_ALPHA_COMPONENT = 0;
const MAXIMUM_ALPHA_COMPONENT = 1;

function calculateColorFromGradient(stops: ColorStop[], offset: number): RgbLike {
  const firstStop = stops[0];
  if (!firstStop) throw new Error("The list of stops must not be empty");

  const lastStop = stops.at(-1)!;

  if (offset <= firstStop.offset) return firstStop.color;
  if (offset >= lastStop.offset) return lastStop.color;

  const sortedStops = (firstStop === lastStop ? [firstStop, lastStop] : stops).toSorted(
    (a, b) => a.offset - b.offset,
  );

  const adjacentStops = toArrayWindows(sortedStops, 2);

  const nearestStops = adjacentStops.find(([a, b]) => a.offset <= offset && offset <= b.offset);

  if (!nearestStops) throw new Error("Could not find the nearest stops");

  const [smallerStop, bigStop] = nearestStops;
  const weight = (offset - smallerStop.offset) / (bigStop.offset - smallerStop.offset);

  type Components = [number, number];
  const rs = nearestStops.map((value) => value.color[0]) as Components;
  const gs = nearestStops.map((value) => value.color[1]) as Components;
  const bs = nearestStops.map((value) => value.color[2]) as Components;
  const as = nearestStops.map((value) => value.color[3] ?? MAXIMUM_ALPHA_COMPONENT) as Components;

  return [lerp(...rs, weight), lerp(...gs, weight), lerp(...bs, weight), lerp(...as, weight)];
}

export {
  calculateColorFromGradient,
  MAXIMUM_ALPHA_COMPONENT,
  MAXIMUM_RGB_COMPONENT,
  MINIMUM_ALPHA_COMPONENT,
  MINIMUM_RGB_COMPONENT,
  RGB_SIZE,
  RGBA_SIZE,
};
export type { ColorStop, Rgb, Rgba, RgbLike };
