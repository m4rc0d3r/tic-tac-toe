import { zBooleanishString } from "@tic-tac-toe/core";
import { z } from "zod";

const zAppConfig = z
  .object({
    NODE_ENV: z.enum(["dev", "prod"]),
    APP_ADDRESS: z.string().nonempty(),
    APP_PORT: z.coerce.number().positive(),
    APP_CLOSE_GRACE_DELAY: z.coerce.number().nonnegative(),
    APP_LOG_LEVEL: z.enum(["fatal", "error", "warn", "info", "debug", "trace", "silent"]),
    APP_PRETTY_LOGS: zBooleanishString,
    APP_GEOLOCATION_BY_IP_PROVIDER: z.enum(["ipwhois", "freeipapi"]),
  })
  .transform(
    ({
      NODE_ENV,
      APP_ADDRESS,
      APP_PORT,
      APP_CLOSE_GRACE_DELAY,
      APP_LOG_LEVEL,
      APP_PRETTY_LOGS,
      APP_GEOLOCATION_BY_IP_PROVIDER,
    }) => {
      const nodeEnv = NODE_ENV;
      const address = APP_ADDRESS;
      const port = APP_PORT;
      const closeGraceDelay = APP_CLOSE_GRACE_DELAY;
      const logLevel = APP_LOG_LEVEL;
      const prettyLogs = APP_PRETTY_LOGS;
      const geolocationByIpProvider = APP_GEOLOCATION_BY_IP_PROVIDER;
      return {
        nodeEnv,
        address,
        port,
        closeGraceDelay,
        logLevel,
        prettyLogs,
        geolocationByIpProvider,
      };
    },
  );
type AppConfig = z.infer<typeof zAppConfig>;

export { zAppConfig };
export type { AppConfig };
