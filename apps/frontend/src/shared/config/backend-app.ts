import { z } from "zod";

const zBackendAppConfig = z
  .object({
    VITE_BACKEND_APP_PROTOCOL: z.string().nonempty(),
    VITE_BACKEND_APP_ADDRESS: z.string().nonempty(),
    VITE_BACKEND_APP_PORT: z.coerce.number().positive(),
  })
  .transform(({ VITE_BACKEND_APP_PROTOCOL, VITE_BACKEND_APP_ADDRESS, VITE_BACKEND_APP_PORT }) => {
    const protocol = VITE_BACKEND_APP_PROTOCOL;
    const address = VITE_BACKEND_APP_ADDRESS;
    const port = VITE_BACKEND_APP_PORT;
    return {
      protocol,
      address,
      port,
      url() {
        return `${protocol}://${address}:${port}`;
      },
    };
  });
type BackendAppConfig = z.infer<typeof zBackendAppConfig>;

export { zBackendAppConfig };
export type { BackendAppConfig };
