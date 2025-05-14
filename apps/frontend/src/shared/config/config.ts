import { ConfigVarsError } from "@tic-tac-toe/core";
import { z } from "zod";

import { zBackendAppConfig } from "./backend-app";
import { zSessionConfig } from "./session";
import { zTrpcConfig } from "./trpc";

const zConfig = z.object({
  backendApp: zBackendAppConfig,
  session: zSessionConfig,
  trpc: zTrpcConfig,
});
type Config = z.infer<typeof zConfig>;

function createConfig(variables: Record<string, unknown>): Config {
  try {
    const backendApp = zBackendAppConfig.parse(variables);
    return {
      backendApp,
      session: zSessionConfig.parse(variables),
      trpc: zTrpcConfig.parse(variables),
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw ConfigVarsError.fromZodError(error);
    }
    throw error;
  }
}

export { createConfig, zConfig };
export type { Config };
