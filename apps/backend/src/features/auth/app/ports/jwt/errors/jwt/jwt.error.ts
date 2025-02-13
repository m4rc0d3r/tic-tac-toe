import type { Reason } from "./reason";

import type { OperationalErrorOptions } from "~/shared";
import { OperationalError } from "~/shared";

class JwtError extends OperationalError {
  constructor(
    readonly reason: Reason,
    options?: OperationalErrorOptions,
  ) {
    super(options);
    switch (this.reason) {
      case "CONTAINS_INVALID_CHARACTERS":
        this.message = "The header or payload could not be parsed.";
        break;
      case "MALFORMED":
        this.message = "A token does not consist of 3 components (separated by a '.').";
        break;
      case "SIGNATURE_REQUIRED":
        this.message = "Signature missing.";
        break;
      case "INVALID_SIGNATURE":
        this.message = "The signature is invalid.";
        break;
    }
  }
}

export { JwtError };
