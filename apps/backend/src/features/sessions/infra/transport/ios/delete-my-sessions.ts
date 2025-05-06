import type { z } from "zod";

import { zDeleteUserSessionsIn } from "~/features/sessions/app";

const zDeleteMySessionsIn = zDeleteUserSessionsIn.pick({
  deleteMode: true,
});
type DeleteMySessionsIn = z.infer<typeof zDeleteMySessionsIn>;

export { zDeleteMySessionsIn };
export type { DeleteMySessionsIn };
