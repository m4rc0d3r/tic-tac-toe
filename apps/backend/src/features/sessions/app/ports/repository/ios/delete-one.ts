import type { z } from "zod";

import { zSession } from "~/core";

const zDeleteOneIn = zSession
  .pick({
    id: true,
  })
  .merge(zSession.pick({ userId: true }).partial());
type DeleteOneIn = z.infer<typeof zDeleteOneIn>;

const zDeleteOneOut = zSession;
type DeleteOneOut = z.infer<typeof zDeleteOneOut>;

export { zDeleteOneIn, zDeleteOneOut };
export type { DeleteOneIn, DeleteOneOut };
