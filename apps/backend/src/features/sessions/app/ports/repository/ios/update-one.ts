import type { z } from "zod";

import { zSession } from "~/core";

const zUpdateOneIn = zSession
  .omit({
    createdAt: true,
    maximumAge: true,
    userId: true,
  })
  .partial()
  .merge(
    zSession.pick({
      id: true,
    }),
  );
type UpdateOneIn = z.infer<typeof zUpdateOneIn>;

const zUpdateOneOut = zSession;
type UpdateOneOut = z.infer<typeof zUpdateOneOut>;

export { zUpdateOneIn, zUpdateOneOut };
export type { UpdateOneIn, UpdateOneOut };
