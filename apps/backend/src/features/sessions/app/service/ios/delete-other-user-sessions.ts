import { z } from "zod";

import { zSession } from "~/core";

const zDeleteOtherUserSessionsIn = z.object({
  initiatingSessionId: zSession.shape.id,
});
type DeleteOtherUserSessionsIn = z.infer<typeof zDeleteOtherUserSessionsIn>;

export { zDeleteOtherUserSessionsIn };
export type { DeleteOtherUserSessionsIn };
