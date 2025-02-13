import { z } from "zod";

const zReason = z.enum([
  "CONTAINS_INVALID_CHARACTERS",
  "MALFORMED",
  "SIGNATURE_REQUIRED",
  "INVALID_SIGNATURE",
]);
type Reason = z.infer<typeof zReason>;

export { zReason };
export type { Reason };
