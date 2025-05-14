import type { z } from "zod";

import { zSession } from "~/core";

const zUpdateLastAccessDateIn = zSession.pick({
  id: true,
});
type UpdateLastAccessDateIn = z.infer<typeof zUpdateLastAccessDateIn>;

const zUpdateLastAccessDateOut = zSession;
type UpdateLastAccessDateOut = z.infer<typeof zUpdateLastAccessDateOut>;

export { zUpdateLastAccessDateIn, zUpdateLastAccessDateOut };
export type { UpdateLastAccessDateIn, UpdateLastAccessDateOut };
