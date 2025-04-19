function isEven(value: number) {
  return value % 2 === 0;
}

function isOdd(value: number) {
  return !isEven(value);
}

function randomInt(min: number, max: number, inclusive = false) {
  return Math.floor(Math.random() * (max - min + (inclusive ? 1 : 0))) + min;
}

export { isEven, isOdd, randomInt };
