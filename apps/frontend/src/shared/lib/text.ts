import { COMMA_WITH_SPACE, EMPTY_STRING, SPACE } from "@tic-tac-toe/core";

function listWithConjunction(items: string[], conjunction: string) {
  return items.length === 0
    ? EMPTY_STRING
    : items.length === 1
      ? items.at(0)!
      : [items.slice(0, -1).join(COMMA_WITH_SPACE), conjunction, items.at(-1)].join(SPACE);
}

function putInQuotes(value: string) {
  return `'${value}'`;
}

export { listWithConjunction, putInQuotes };
