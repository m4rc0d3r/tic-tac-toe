import { MILLISECONDS_PER_SECOND } from "@tic-tac-toe/core";

function toSeconds(milliseconds: number, precision = 1) {
  return (milliseconds / MILLISECONDS_PER_SECOND).toFixed(precision);
}

function asPercentage(value: number) {
  return value * 100;
}

export { asPercentage, toSeconds };
