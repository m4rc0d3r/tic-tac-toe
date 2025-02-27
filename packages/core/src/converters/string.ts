import { EMPTY_STRING } from "~/constants";

function capitalize<T extends string>(value: T): Capitalize<T> {
  return [value.at(0)?.toLocaleUpperCase(), value.slice(1).toLocaleLowerCase()].join(
    EMPTY_STRING,
  ) as Capitalize<T>;
}

export { capitalize };
