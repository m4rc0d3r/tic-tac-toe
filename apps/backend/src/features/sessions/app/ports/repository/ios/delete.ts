import type { z } from "zod";

import { zSession } from "~/core";

const zDeleteIn = zSession.pick({
  userId: true,
});
type DeleteIn = z.infer<typeof zDeleteIn>;

type DeleteOut = number;

export { zDeleteIn };
export type { DeleteIn, DeleteOut };
