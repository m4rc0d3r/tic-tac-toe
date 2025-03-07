import { zBooleanishString } from "@tic-tac-toe/core";
import { z } from "zod";

const zAppConfig = z
  .object({
    APP_PORT: z.coerce.number().positive(),
    APP_CLOSE_GRACE_DELAY: z.coerce.number().nonnegative(),
    APP_LOG_LEVEL: z.enum(["fatal", "error", "warn", "info", "debug", "trace", "silent"]),
    APP_PRETTY_LOGS: zBooleanishString,
  })
  .transform(({ APP_PORT, APP_CLOSE_GRACE_DELAY, APP_LOG_LEVEL, APP_PRETTY_LOGS }) => {
    const port = APP_PORT;
    const closeGraceDelay = APP_CLOSE_GRACE_DELAY;
    const logLevel = APP_LOG_LEVEL;
    const prettyLogs = APP_PRETTY_LOGS;
    return {
      port,
      closeGraceDelay,
      logLevel,
      prettyLogs,
    };
  });
type AppConfig = z.infer<typeof zAppConfig>;

export { zAppConfig };
export type { AppConfig };
