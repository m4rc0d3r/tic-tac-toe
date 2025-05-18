import { zFromVercelTimeFormatToMilliseconds } from "@tic-tac-toe/core";
import { z } from "zod";

const zSessionConfig = z
  .object({
    MAXIMUM_SESSION_AGE: zFromVercelTimeFormatToMilliseconds,
    MINIMUM_SESSION_AGE_FOR_DESTROYING_OTHERS: zFromVercelTimeFormatToMilliseconds,
    SESSION_COOKIE_NAME: z.string().nonempty(),
    HOW_OFTEN_TO_DELETE_EXPIRED_SESSIONS: zFromVercelTimeFormatToMilliseconds,
  })
  .transform(
    ({
      MAXIMUM_SESSION_AGE,
      MINIMUM_SESSION_AGE_FOR_DESTROYING_OTHERS,
      SESSION_COOKIE_NAME,
      HOW_OFTEN_TO_DELETE_EXPIRED_SESSIONS,
    }) => ({
      maximumAge: MAXIMUM_SESSION_AGE,
      minimumAgeForDestructionOfOthers: MINIMUM_SESSION_AGE_FOR_DESTROYING_OTHERS,
      cookieName: SESSION_COOKIE_NAME,
      howOftenToDeleteExpired: HOW_OFTEN_TO_DELETE_EXPIRED_SESSIONS,
    }),
  );
type SessionConfig = z.infer<typeof zSessionConfig>;

export { zSessionConfig };
export type { SessionConfig };
