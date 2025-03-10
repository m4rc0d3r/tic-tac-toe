import { z } from "zod";

const zReason = z.enum(["INCORRECT_PASSWORD"]);
type Reason = z.infer<typeof zReason>;

export { zReason };
export type { Reason };
