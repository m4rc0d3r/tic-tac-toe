import { z } from "zod";

import { zSession } from "~/core";

const zDeleteIn = zSession
  .pick({
    userId: true,
  })
  .merge(
    z.object({
      exceptForSessionId: zSession.shape.id,
    }),
  );
type DeleteIn = z.infer<typeof zDeleteIn>;

const zDeleteOut = z.array(zSession);
type DeleteOut = z.infer<typeof zDeleteOut>;

export { zDeleteIn, zDeleteOut };
export type { DeleteIn, DeleteOut };
