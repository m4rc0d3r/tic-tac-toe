import { zVercelTimeFormat } from "@tic-tac-toe/core";
import { z } from "zod";

const zAuthenticationConfig = z
  .object({
    ACCESS_TOKEN_SECRET: z.string().nonempty(),
    ACCESS_TOKEN_LIFETIME: zVercelTimeFormat,
    REFRESH_TOKEN_SECRET: z.string().nonempty(),
    REFRESH_TOKEN_LIFETIME: zVercelTimeFormat,
    REFRESH_TOKEN_COOKIE_NAME: z.string().nonempty(),
  })
  .transform(
    ({
      ACCESS_TOKEN_SECRET,
      ACCESS_TOKEN_LIFETIME,
      REFRESH_TOKEN_SECRET,
      REFRESH_TOKEN_LIFETIME,
      REFRESH_TOKEN_COOKIE_NAME,
    }) => ({
      jwt: {
        access: {
          secret: ACCESS_TOKEN_SECRET,
          lifetime: ACCESS_TOKEN_LIFETIME,
        },
        refresh: {
          secret: REFRESH_TOKEN_SECRET,
          lifetime: REFRESH_TOKEN_LIFETIME,
        },
      },
      refreshTokenCookieName: REFRESH_TOKEN_COOKIE_NAME,
    }),
  );
type AuthenticationConfig = z.infer<typeof zAuthenticationConfig>;

export { zAuthenticationConfig };
export type { AuthenticationConfig };
