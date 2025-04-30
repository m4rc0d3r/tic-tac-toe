import { zFromVercelTimeFormatToMilliseconds } from "@tic-tac-toe/core";
import { z } from "zod";

const zSessionConfig = z
  .object({
    MAXIMUM_SESSION_AGE: zFromVercelTimeFormatToMilliseconds,
    MINIMUM_SESSION_AGE_FOR_DESTROYING_OTHERS: zFromVercelTimeFormatToMilliseconds,
  })
  .transform(({ MAXIMUM_SESSION_AGE, MINIMUM_SESSION_AGE_FOR_DESTROYING_OTHERS }) => ({
    maximumAge: MAXIMUM_SESSION_AGE,
    minimumAgeForDestructionOfOthers: MINIMUM_SESSION_AGE_FOR_DESTROYING_OTHERS,
  }));
type SessionConfig = z.infer<typeof zSessionConfig>;

export { zSessionConfig };
export type { SessionConfig };
