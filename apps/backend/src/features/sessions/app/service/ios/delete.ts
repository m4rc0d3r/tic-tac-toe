import { z } from "zod";

import { zRawSession } from "~/core";

const zDeleteIn = z.object({
  initiatingSessionId: zRawSession.shape.id,
});
type DeleteIn = z.infer<typeof zDeleteIn>;

export { zDeleteIn };
export type { DeleteIn };
