import type { FastifyTRPCPluginOptions } from "@trpc/server/adapters/fastify";
import { fastifyTRPCPlugin } from "@trpc/server/adapters/fastify";
import type { FastifyPluginAsync } from "fastify";

import { createTrpcContext, trpcRouter } from "./infra";

const appRouter = trpcRouter({});
type AppRouter = typeof appRouter;

const app: FastifyPluginAsync = async (fastify, _opts): Promise<void> => {
  fastify.register(fastifyTRPCPlugin, {
    prefix: "trpc",
    trpcOptions: {
      router: appRouter,
      createContext: createTrpcContext,
    } satisfies FastifyTRPCPluginOptions<AppRouter>["trpcOptions"],
  });

  await Promise.resolve();
};

export default app;
export { app };
