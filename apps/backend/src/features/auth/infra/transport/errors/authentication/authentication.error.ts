import type { OperationalErrorOptions } from "@tic-tac-toe/core";
import { OperationalError } from "@tic-tac-toe/core";

import type { Reason } from "./reason";

class AuthenticationError extends OperationalError {
  constructor(
    readonly reason: Reason,
    options?: OperationalErrorOptions,
  ) {
    super(options);
    switch (this.reason) {
      case "NO_DATA": {
        this.message = "No authentication related data.";
        break;
      }
      case "INCORRECT_DATA": {
        this.message = "The provided authentication data is not formed correctly.";
        break;
      }
      case "DATA_IS_MISSING_FROM_STORAGE": {
        this.message =
          "Unable to find data in internal storage that confirms the validity of the provided authentication data.";
        break;
      }
      case "DATA_IS_EXPIRED": {
        this.message = "The authentication data is present, but has expired.";
        break;
      }
      default: {
        this.message = "An authentication error occurred.";
      }
    }
  }
}

export { AuthenticationError };
