import { COLON, EMPTY_STRING } from "@tic-tac-toe/core";
import { z } from "zod";

const zFrontendAppConfig = z
  .object({
    FRONTEND_APP_PROTOCOL: z.string().nonempty(),
    FRONTEND_APP_ADDRESS: z.string().nonempty(),
    FRONTEND_APP_PORT: z.preprocess((value) => {
      if (typeof value === "number") return value;

      if (typeof value === "string") return value.length > 0 ? Number(value) : undefined;

      return value;
    }, z.number().positive().optional()),
  })
  .transform(({ FRONTEND_APP_PROTOCOL, FRONTEND_APP_ADDRESS, FRONTEND_APP_PORT }) => {
    const protocol = FRONTEND_APP_PROTOCOL;
    const address = FRONTEND_APP_ADDRESS;
    const port = FRONTEND_APP_PORT;
    return {
      protocol,
      address,
      port,
      url() {
        return `${protocol}://${address}${typeof port === "number" ? [COLON, port].join(EMPTY_STRING) : EMPTY_STRING}`;
      },
    };
  });
type FrontendAppConfig = z.infer<typeof zFrontendAppConfig>;

export { zFrontendAppConfig };
export type { FrontendAppConfig };
