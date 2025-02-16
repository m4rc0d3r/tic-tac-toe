import type { OperationalErrorOptions } from "@tic-tac-toe/core";
import { OperationalError } from "@tic-tac-toe/core";

type FilterCriteria = Record<string, unknown>;

class NotFoundError extends OperationalError {
  constructor(
    readonly filterCriteria: FilterCriteria,
    options?: OperationalErrorOptions,
  ) {
    super(options);
    this.message = `No objects were found matching the filter criteria ${JSON.stringify(this.filterCriteria)}.`;
  }
}

export { NotFoundError };
export type { FilterCriteria };
