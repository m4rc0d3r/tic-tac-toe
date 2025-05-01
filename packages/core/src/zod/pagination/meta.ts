import { z } from "zod";

import type { PageOptions } from "./options";
import { zPageOptions } from "./options";

const zPageMeta = z.object({
  ...zPageOptions.removeDefault().shape,
  numberOfItems: z.number().int().nonnegative(),
  numberOfPages: z.number().int().nonnegative(),
  hasPrevious: z.boolean(),
  hasNext: z.boolean(),
});
type PageMeta = z.infer<typeof zPageMeta>;

function createPageMeta({ page, take }: PageOptions, numberOfItems: number): PageMeta {
  const numberOfPages = Math.ceil(numberOfItems / take);
  return {
    page,
    take,
    numberOfItems,
    numberOfPages,
    hasPrevious: page > 1 && page <= numberOfPages,
    hasNext: page < numberOfPages,
  };
}

export { createPageMeta, zPageMeta };
export type { PageMeta };
