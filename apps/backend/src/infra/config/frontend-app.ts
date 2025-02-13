import { z } from "zod";

const zFrontendAppConfig = z
  .object({
    FRONTEND_APP_PROTOCOL: z.string().nonempty(),
    FRONTEND_APP_ADDRESS: z.string().nonempty(),
    FRONTEND_APP_PORT: z.coerce.number().positive(),
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
        return `${protocol}://${address}:${port}`;
      },
    };
  });
type FrontendAppConfig = z.infer<typeof zFrontendAppConfig>;

export { zFrontendAppConfig };
export type { FrontendAppConfig };
