import type { Reason } from "./reason";

import type { OperationalErrorOptions } from "~/shared";
import { OperationalError } from "~/shared";

class AuthenticationError extends OperationalError {
  constructor(
    readonly reason: Reason,
    options?: OperationalErrorOptions,
  ) {
    super(options);
    switch (this.reason.inBrief) {
      case "INVALID_REQUEST": {
        this.message = "The request data related to authorization is not formed correctly.";
        break;
      }
      case "INVALID_TOKEN": {
        this.message = "The provided access token is invalid for some reason.";
        break;
      }
      case "ALREADY_AUTHENTICATED": {
        this.message = "You have already been authenticated.";
        break;
      }
      default: {
        this.message = "An authentication error occurred.";
      }
    }
  }
}

export { AuthenticationError };
