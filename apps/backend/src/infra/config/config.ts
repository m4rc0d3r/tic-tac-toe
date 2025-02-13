import { either as e } from "fp-ts";
import { z } from "zod";

import { zBcryptConfig } from "./bcrypt";
import { ConfigVarsError } from "./config-vars.error";
import { zTrpcConfig } from "./trpc";

const zConfig = z.object({
  bcrypt: zBcryptConfig,
  trpc: zTrpcConfig,
});
type Config = z.infer<typeof zConfig>;

function createConfig(variables: Record<string, unknown>): e.Either<ConfigVarsError, Config> {
  return e.tryCatch(
    () => {
      return {
        bcrypt: zBcryptConfig.parse(variables),
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
