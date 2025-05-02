import { ConfigVarsError } from "@tic-tac-toe/core";
import { either as e } from "fp-ts";
import { z } from "zod";

import { zAppConfig } from "./app";
import { zBcryptConfig } from "./bcrypt";
import { zCookieConfig } from "./cookie";
import type { CorsConfig } from "./cors";
import { zCorsConfig } from "./cors";
import { zFrontendAppConfig } from "./frontend-app";
import { zSessionConfig } from "./session";
import { zTrpcConfig } from "./trpc";
import { zVercelConfig } from "./vercel";

const zConfig = z.object({
  app: zAppConfig,
  bcrypt: zBcryptConfig,
  cookie: zCookieConfig,
  frontendApp: zFrontendAppConfig,
  cors: zCorsConfig,
  session: zSessionConfig,
  trpc: zTrpcConfig,
  vercel: zVercelConfig,
});
type Config = z.infer<typeof zConfig>;

function createConfig(variables: Record<string, unknown>): e.Either<ConfigVarsError, Config> {
  return e.tryCatch(
    () => {
      const frontendApp = zFrontendAppConfig.parse(variables);
      return {
        app: zAppConfig.parse(variables),
        bcrypt: zBcryptConfig.parse(variables),
        cookie: zCookieConfig.parse(variables),
        cors: zCorsConfig.parse({
          origin: frontendApp.url(),
          credentials: true,
        } satisfies CorsConfig),
        frontendApp,
        session: zSessionConfig.parse(variables),
        trpc: zTrpcConfig.parse(variables),
        vercel: zVercelConfig.parse(variables),
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
