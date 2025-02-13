import type { OperationalErrorOptions } from "~/shared";
import { capitalize, OperationalError } from "~/shared";

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
    this.message = `${capitalizedType} key constraint consisting of attributes in the paths ${this.paths.map((p) => `'${p}'`).join(", ")} was violated.`;
  }
}

export { KeyViolationError };
export type { KeyType, Paths };
