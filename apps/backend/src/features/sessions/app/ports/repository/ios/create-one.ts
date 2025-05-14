import type { z } from "zod";

import { zSession } from "~/core";

const zCreateOneIn = zSession.omit({
  createdAt: true,
  lastAccessedAt: true,
});
type CreateOneIn = z.infer<typeof zCreateOneIn>;

const zCreateOneOut = zSession;
type CreateOneOut = z.infer<typeof zCreateOneOut>;

export { zCreateOneIn, zCreateOneOut };
export type { CreateOneIn, CreateOneOut };
