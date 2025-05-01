import { z } from "zod";

const DEFAULT_PAGE = 1;
const DEFAULT_TAKE = 10;

const zPageOptions = z
  .object({
    page: z.number().int().positive().default(DEFAULT_PAGE),
    take: z.number().int().positive().default(DEFAULT_TAKE),
  })
  .default({
    page: DEFAULT_PAGE,
    take: DEFAULT_TAKE,
  });
type PageOptions = z.infer<typeof zPageOptions>;

export { zPageOptions };
export type { PageOptions };
