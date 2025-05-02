import { z } from "zod";

const zReason = z.enum([
  "NO_DATA",
  "INCORRECT_DATA",
  "DATA_IS_MISSING_FROM_STORAGE",
  "DATA_IS_EXPIRED",
]);
type Reason = z.infer<typeof zReason>;

export { zReason };
export type { Reason };
