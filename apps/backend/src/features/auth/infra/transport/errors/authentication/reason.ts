import { z } from "zod";

import { JwtError, JwtExpirationError } from "~/features/auth/app/ports/jwt";

const zReason = z.discriminatedUnion("inBrief", [
  z.object({
    inBrief: z.literal("INVALID_REQUEST"),
    inDetail: z.enum([
      "AUTHORIZATION_HEADER_MISSING",
      "AUTHORIZATION_HEADER_MALFORMED",
      "MISSING_AUTHENTICATION_COOKIE",
    ]),
  }),
  z.object({
    inBrief: z.literal("INVALID_TOKEN"),
    inDetail: z.union([z.instanceof(JwtError), z.instanceof(JwtExpirationError)]),
  }),
  z.object({
    inBrief: z.literal("ALREADY_AUTHENTICATED"),
  }),
]);
type Reason = z.infer<typeof zReason>;

export { zReason };
export type { Reason };
