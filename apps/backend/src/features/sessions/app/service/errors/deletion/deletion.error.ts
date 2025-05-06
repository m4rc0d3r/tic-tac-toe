import type { OperationalErrorOptions } from "@tic-tac-toe/core";
import { OperationalError } from "@tic-tac-toe/core";

import type { Explanation } from "./reason";

class SessionDeletionError extends OperationalError {
  constructor(
    readonly explanation: Explanation,
    options?: OperationalErrorOptions,
  ) {
    super(options);
    const { reason } = explanation;
    switch (reason) {
      case "INITIATING_SESSION_DOES_NOT_EXIST":
        this.message = "Unable to find initiating session.";
        break;
      case "INITIATING_SESSION_HAS_ALREADY_EXPIRED":
        this.message = "The initiating session is invalid because it has already expired.";
        break;
      case "INITIATING_SESSION_IS_TOO_YOUNG":
        this.message = `The initiating session is too young to delete another session. Removal will only be available after ${explanation.whenItWillBePossible.toISOString()}.`;
        break;
    }
  }
}

export { SessionDeletionError };
