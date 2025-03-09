import type { OperationalErrorOptions } from "@tic-tac-toe/core";
import { OperationalError } from "@tic-tac-toe/core";

class BlobNotFoundError extends OperationalError {
  constructor(
    readonly url: string,
    options?: OperationalErrorOptions,
  ) {
    super(options);
    this.message = `BLOB at "${this.url}" not found.`;
  }
}

export { BlobNotFoundError };
