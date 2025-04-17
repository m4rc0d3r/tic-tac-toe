const NON_EXISTENT_INDEX = -1;

function range(stop: number): number[];
function range(start: number, stop: number): number[];
function range(start: number, stop: number, step: number): number[];
function range(startOrStop: number, stop_?: number, step = 1) {
  if (step === 0) {
    throw new RangeError('"step" must not be zero');
  }

  const [start, stop] = stop_ === undefined ? [0, startOrStop] : [startOrStop, stop_];

  const values = [];

  for (let i = 0; ; ++i) {
    const value = start + step * i;
    if (step > 0 ? value < stop : value > stop) {
      values.push(value);
    } else {
      break;
    }
  }

  return values;
}

function shuffle<T>(values: T[]) {
  return values.toSorted(() => Math.random() - 0.5);
}

export { NON_EXISTENT_INDEX, range, shuffle };
