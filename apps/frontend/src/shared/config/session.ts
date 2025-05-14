import { zFromVercelTimeFormatToMilliseconds } from "@tic-tac-toe/core";
import { z } from "zod";

const zSessionConfig = z
  .object({
    VITE_SESSION_LAST_ACCESS_DATE_UPDATE_INTERVAL: zFromVercelTimeFormatToMilliseconds,
  })
  .transform(({ VITE_SESSION_LAST_ACCESS_DATE_UPDATE_INTERVAL }) => ({
    lastAccessDateUpdateInterval: VITE_SESSION_LAST_ACCESS_DATE_UPDATE_INTERVAL,
  }));
type SessionConfig = z.infer<typeof zSessionConfig>;

export { zSessionConfig };
export type { SessionConfig };
