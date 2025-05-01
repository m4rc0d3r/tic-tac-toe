import { z } from "zod";

const zReason = z.enum([
  "INITIATING_SESSION_DOES_NOT_EXIST",
  "INITIATING_SESSION_HAS_ALREADY_EXPIRED",
  "INITIATING_SESSION_IS_TOO_YOUNG",
]);
type Reason = z.infer<typeof zReason>;

export { zReason };
export type { Reason };
