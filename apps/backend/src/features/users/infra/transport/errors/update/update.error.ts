import type { OperationalErrorOptions } from "@tic-tac-toe/core";
import { OperationalError } from "@tic-tac-toe/core";

import type { Reason } from "./reason";

class UserUpdateError extends OperationalError {
  constructor(
    readonly reason: Reason,
    options?: OperationalErrorOptions,
  ) {
    super(options);
    this.message = "Failed to update data.";
    switch (this.reason) {
      case "INCORRECT_PASSWORD": {
        this.message = "Incorrect password.";
        break;
      }
    }
  }
}

export { UserUpdateError };
