import { z } from "zod";

const zExplanation = z.discriminatedUnion("reason", [
  z.object({
    reason: z.enum(["INITIATING_SESSION_DOES_NOT_EXIST", "INITIATING_SESSION_HAS_ALREADY_EXPIRED"]),
  }),
  z.object({
    reason: z.literal("INITIATING_SESSION_IS_TOO_YOUNG"),
    whenItWillBePossible: z.date(),
  }),
]);
type Explanation = z.infer<typeof zExplanation>;

export { zExplanation };
export type { Explanation };
