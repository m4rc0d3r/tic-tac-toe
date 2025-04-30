import { z } from "zod";

import { zFindOneOut } from "./find-one";

import { zPageOptions } from "@tic-tac-toe/core";
import { zSession } from "~/core";

const zListIn = z.object({
  filter: zSession.pick({
    userId: true,
  }),
  pageOptions: zPageOptions,
});
type ListIn = z.infer<typeof zListIn>;

const zListOut = z.array(zFindOneOut);
type ListOut = z.infer<typeof zListOut>;

export { zListIn, zListOut };
export type { ListIn, ListOut };
