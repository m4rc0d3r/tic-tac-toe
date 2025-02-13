import type { OperationalErrorOptions } from "~/shared";
import { OperationalError } from "~/shared";

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
