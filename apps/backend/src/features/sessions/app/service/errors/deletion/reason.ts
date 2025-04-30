import { z } from "zod";

const zReason = z.enum(["INITIATING_SESSION_IS_TOO_YOUNG", "INITIATING_SESSION_DOES_NOT_EXIST"]);
type Reason = z.infer<typeof zReason>;

export { zReason };
export type { Reason };
