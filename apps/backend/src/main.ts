import fastifyCookie from "@fastify/cookie";
import fastifyCors from "@fastify/cors";
import type { FastifyTRPCPluginOptions } from "@trpc/server/adapters/fastify";
import { fastifyTRPCPlugin } from "@trpc/server/adapters/fastify";
import { config as dotenvConfig } from "dotenv";
import { expand } from "dotenv-expand";
import type { FastifyPluginAsync } from "fastify";

import { authRouter } from "./features/auth";
import { createDependencies, createTrpcContext, trpcRouter } from "./infra";

const appRouter = trpcRouter({
  auth: authRouter,
});
type AppRouter = typeof appRouter;

const app: FastifyPluginAsync = async (fastify, _opts): Promise<void> => {
  expand(dotenvConfig());

  const eitherDependencies = createDependencies(process.env);
  if (eitherDependencies._tag === "Left") {
    throw eitherDependencies.left;
  }

  const dependencies = eitherDependencies.right;
  const { config } = dependencies;

  fastify.register(fastifyCors, config.cors);

  const {
    cookie: { secret },
  } = config;
  fastify.register(fastifyCookie, {
    secret,
    hook: "onRequest",
  });

  const {
    trpc: { prefix },
  } = config;
  fastify.register(fastifyTRPCPlugin, {
    prefix,
    trpcOptions: {
      router: appRouter,
      createContext: (opts) =>
        createTrpcContext({
          ...opts,
          ...dependencies,
        }),
    } satisfies FastifyTRPCPluginOptions<AppRouter>["trpcOptions"],
  });

  await Promise.resolve();
};

export default app;
export { app };
export type { AppRouter };
