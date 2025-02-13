import type { KeyType, Paths } from "./base.error";
import { KeyViolationError } from "./base.error";

import type { OperationalErrorOptions } from "~/shared";

const KEY_TYPE = "unique";

class UniqueKeyViolationError<T extends Paths = Paths> extends KeyViolationError<
  typeof KEY_TYPE,
  T
> {
  constructor(
    override readonly paths: T,
    options?: OperationalErrorOptions,
  ) {
    super(KEY_TYPE, paths, options);
  }
}

export { UniqueKeyViolationError };
export type { KeyType };
