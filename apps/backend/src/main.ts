import type { FastifyTRPCPluginOptions } from "@trpc/server/adapters/fastify";
import { fastifyTRPCPlugin } from "@trpc/server/adapters/fastify";
import { config as dotenvConfig } from "dotenv";
import { expand } from "dotenv-expand";
import type { FastifyPluginAsync } from "fastify";

import { createConfig, createTrpcContext, trpcRouter } from "./infra";

const appRouter = trpcRouter({});
type AppRouter = typeof appRouter;

const app: FastifyPluginAsync = async (fastify, _opts): Promise<void> => {
  expand(dotenvConfig());

  const eitherConfig = createConfig(process.env);
  if (eitherConfig._tag === "Left") {
    throw eitherConfig.left;
  }

  const {
    trpc: { prefix },
  } = eitherConfig.right;

  fastify.register(fastifyTRPCPlugin, {
    prefix,
    trpcOptions: {
      router: appRouter,
      createContext: createTrpcContext,
    } satisfies FastifyTRPCPluginOptions<AppRouter>["trpcOptions"],
  });

  await Promise.resolve();
};

export default app;
export { app };
