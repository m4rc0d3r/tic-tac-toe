import { z } from "zod";

import { zSession } from "../entities";

const zEventMap = z.object({
  sessionTerminated: z.tuple([
    zSession.pick({
      id: true,
    }),
  ]),
});
type EventMap = z.infer<typeof zEventMap>;

export { zEventMap };
export type { EventMap };
