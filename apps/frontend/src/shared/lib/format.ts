const MILLISECONDS_PER_SECOND = 1000;

function toSeconds(milliseconds: number, precision = 1) {
  return (milliseconds / MILLISECONDS_PER_SECOND).toFixed(precision);
}

export { toSeconds };
