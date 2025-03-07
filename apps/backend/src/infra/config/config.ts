import { ConfigVarsError } from "@tic-tac-toe/core";
import { either as e } from "fp-ts";
import { z } from "zod";

import { zAppConfig } from "./app";
import { zAuthenticationConfig } from "./authentication";
import { zBcryptConfig } from "./bcrypt";
import { zCookieConfig } from "./cookie";
import type { CorsConfig } from "./cors";
import { zCorsConfig } from "./cors";
import { zFrontendAppConfig } from "./frontend-app";
import { zTrpcConfig } from "./trpc";

const zConfig = z.object({
  app: zAppConfig,
  authentication: zAuthenticationConfig,
  bcrypt: zBcryptConfig,
  cookie: zCookieConfig,
  frontendApp: zFrontendAppConfig,
  cors: zCorsConfig,

  trpc: zTrpcConfig,
});
type Config = z.infer<typeof zConfig>;

function createConfig(variables: Record<string, unknown>): e.Either<ConfigVarsError, Config> {
  return e.tryCatch(
    () => {
      const frontendApp = zFrontendAppConfig.parse(variables);
      return {
        app: zAppConfig.parse(variables),
        authentication: zAuthenticationConfig.parse(variables),
        bcrypt: zBcryptConfig.parse(variables),
        cookie: zCookieConfig.parse(variables),
        cors: zCorsConfig.parse({
          origin: frontendApp.url(),
          credentials: true,
        } satisfies CorsConfig),
        frontendApp,
        trpc: zTrpcConfig.parse(variables),
      };
    },
    (error) => {
      if (error instanceof z.ZodError) {
        return ConfigVarsError.fromZodError(error);
      }
      throw error;
    },
  );
}

export { createConfig, zConfig };
export type { Config };
