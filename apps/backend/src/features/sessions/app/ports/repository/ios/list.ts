import { createPageSchema, zPageOptions } from "@tic-tac-toe/core";
import { z } from "zod";

import { zFindOneOut } from "./find-one";

import { zSession } from "~/core";

const zListIn = z.object({
  filter: zSession.pick({
    userId: true,
  }),
  pageOptions: zPageOptions,
});
type ListIn = z.infer<typeof zListIn>;

const zListOut = createPageSchema(zFindOneOut);
type ListOut = z.infer<typeof zListOut>;

export { zListIn, zListOut };
export type { ListIn, ListOut };
