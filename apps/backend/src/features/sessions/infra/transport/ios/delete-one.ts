import type { z } from "zod";

import { zSession } from "~/core";

const zDeleteOneIn = zSession.pick({
  id: true,
});
type DeleteOneIn = z.infer<typeof zDeleteOneIn>;

export { zDeleteOneIn };
export type { DeleteOneIn };
