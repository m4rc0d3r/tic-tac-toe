import type { z } from "zod";

import { zSession } from "~/core";

const zFindOneIn = zSession.pick({
  id: true,
});
type FindOneIn = z.infer<typeof zFindOneIn>;

const zFindOneOut = zSession;
type FindOneOut = z.infer<typeof zFindOneOut>;

export { zFindOneIn, zFindOneOut };
export type { FindOneIn, FindOneOut };
