import fastifyCookie from "@fastify/cookie";
import fastifyCors from "@fastify/cors";
import type { FastifyTRPCPluginOptions } from "@trpc/server/adapters/fastify";
import { fastifyTRPCPlugin } from "@trpc/server/adapters/fastify";
import closeWithGrace from "close-with-grace";
import { config as dotenvConfig } from "dotenv";
import { expand } from "dotenv-expand";
import fastify from "fastify";

import { authRouter } from "./features/auth";
import { createDependencies, createTrpcContext, trpcRouter } from "./infra";

const appRouter = trpcRouter({
  auth: authRouter,
});
type AppRouter = typeof appRouter;

expand(dotenvConfig());
const eitherDependencies = createDependencies(process.env);
if (eitherDependencies._tag === "Left") {
  // eslint-disable-next-line @typescript-eslint/only-throw-error
  throw eitherDependencies.left;
}
const dependencies = eitherDependencies.right;
const { config } = dependencies;

const {
  app: { logLevel: level, prettyLogs },
} = config;
const app = fastify({
  logger: {
    level,
    ...(prettyLogs && {
      transport: {
        target: "pino-pretty",
      },
    }),
  },
});

app.register(fastifyCors, config.cors);

const {
  cookie: { secret },
} = config;
app.register(fastifyCookie, {
  secret,
  hook: "onRequest",
});

const {
  trpc: { prefix },
} = config;
app.register(fastifyTRPCPlugin, {
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

const {
  app: { closeGraceDelay: delay },
} = config;
closeWithGrace(
  {
    delay,
  },
  async function ({ err }) {
    if (err) {
      app.log.error(err);
    }
    await app.close();
  },
);

const {
  app: { port },
} = config;
app.listen(
  {
    port,
  },
  (err) => {
    if (err) {
      app.log.error(err);
      process.exit(1);
    }
  },
);

export type { AppRouter };
