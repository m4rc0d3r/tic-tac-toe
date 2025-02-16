import type { OperationalErrorOptions } from "@tic-tac-toe/core";
import { OperationalError } from "@tic-tac-toe/core";

class JwtExpirationError extends OperationalError {
  constructor(
    readonly expiredAt: Date,
    options?: OperationalErrorOptions,
  ) {
    super(options);
    this.message = `Token expired on ${this.expiredAt.toString()}`;
  }
}

export { JwtExpirationError };
