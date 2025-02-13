import type { OperationalErrorOptions } from "~/shared";
import { OperationalError } from "~/shared";

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
