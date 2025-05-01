import type { PageOptions } from "./options";

function getTheNumberOfSkippedItems({ page, take }: PageOptions) {
  return (page - 1) * take;
}

export { getTheNumberOfSkippedItems };
