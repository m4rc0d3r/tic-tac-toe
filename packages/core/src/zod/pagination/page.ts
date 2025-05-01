import { z } from "zod";

import { zPageMeta } from "./meta";

function createPageSchema<T extends z.ZodSchema>(item: T) {
  return z.object({
    data: z.array(item),
    meta: zPageMeta,
  });
}
type Page<T extends z.ZodSchema> = z.infer<ReturnType<typeof createPageSchema<T>>>;

export { createPageSchema };
export type { Page };
