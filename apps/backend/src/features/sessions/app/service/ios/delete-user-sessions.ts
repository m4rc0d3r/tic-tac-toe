import { z } from "zod";

import { zSession } from "~/core";

const zDeleteUserSessionsIn = z
  .object({
    initiatingSessionId: zSession.shape.id,
  })
  .merge(
    z.object({
      deleteMode: z.enum(["ALL", "OTHER"]),
    }),
  );
type DeleteUserSessionsIn = z.infer<typeof zDeleteUserSessionsIn>;

export { zDeleteUserSessionsIn };
export type { DeleteUserSessionsIn };
