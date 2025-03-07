import { zBooleanishString } from "@tic-tac-toe/core";
import { z } from "zod";

const zAppConfig = z
  .object({
    NODE_ENV: z.enum(["dev", "prod"]),
    APP_PORT: z.coerce.number().positive(),
    APP_CLOSE_GRACE_DELAY: z.coerce.number().nonnegative(),
    APP_LOG_LEVEL: z.enum(["fatal", "error", "warn", "info", "debug", "trace", "silent"]),
    APP_PRETTY_LOGS: zBooleanishString,
  })
  .transform(({ NODE_ENV, APP_PORT, APP_CLOSE_GRACE_DELAY, APP_LOG_LEVEL, APP_PRETTY_LOGS }) => {
    const nodeEnv = NODE_ENV;
    const port = APP_PORT;
    const closeGraceDelay = APP_CLOSE_GRACE_DELAY;
    const logLevel = APP_LOG_LEVEL;
    const prettyLogs = APP_PRETTY_LOGS;
    return {
      nodeEnv,
      port,
      closeGraceDelay,
      logLevel,
      prettyLogs,
    };
  });
type AppConfig = z.infer<typeof zAppConfig>;

export { zAppConfig };
export type { AppConfig };
