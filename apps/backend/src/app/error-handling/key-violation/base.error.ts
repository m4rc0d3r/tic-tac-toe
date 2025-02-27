import type { OperationalErrorOptions } from "@tic-tac-toe/core";
import { COMMA_WITH_SPACE, OperationalError, capitalize } from "@tic-tac-toe/core";

type KeyType = "foreign" | "unique";
type Paths<T extends string = string> = [T, ...T[]];

abstract class KeyViolationError<
  T extends KeyType,
  U extends Paths = Paths,
> extends OperationalError {
  constructor(
    readonly type: T,
    readonly paths: U,
    options?: OperationalErrorOptions,
  ) {
    super(options);
    const capitalizedType = capitalize(this.type);
    this.message = `${capitalizedType} key constraint consisting of attributes in the paths ${this.paths.map((p) => `'${p}'`).join(COMMA_WITH_SPACE)} was violated.`;
  }
}

export { KeyViolationError };
export type { KeyType, Paths };
