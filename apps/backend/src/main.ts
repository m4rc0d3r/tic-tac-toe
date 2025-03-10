import fastifyCookie from "@fastify/cookie";
import fastifyCors from "@fastify/cors";
import fastifyMultipart from "@fastify/multipart";
import type { FastifyTRPCPluginOptions } from "@trpc/server/adapters/fastify";
import { fastifyTRPCPlugin } from "@trpc/server/adapters/fastify";
import closeWithGrace from "close-with-grace";
import { config as dotenvConfig } from "dotenv";
import { expand } from "dotenv-expand";
import fastify from "fastify";

import { authRouter } from "./features/auth";
import { usersRouter } from "./features/users/infra/transport";
import { createConfig, createDependencies, createTrpcContext, trpcRouter } from "./infra";

declare module "fastify" {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface FastifyRequest {
    body2: FastifyRequest["body"];
  }
}

const appRouter = trpcRouter({
  auth: authRouter,
  users: usersRouter,
});
type AppRouter = typeof appRouter;

expand(dotenvConfig());
const eitherConfig = createConfig(process.env);
if (eitherConfig._tag === "Left") {
  // eslint-disable-next-line @typescript-eslint/only-throw-error
  throw eitherConfig.left;
}
const config = eitherConfig.right;

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

const dependencies = createDependencies(config, app.log);

app.register(fastifyCors, config.cors);

const {
  cookie: { secret },
} = config;
app.register(fastifyCookie, {
  secret,
  hook: "onRequest",
});

app.register(fastifyMultipart, {
  attachFieldsToBody: true,
});

/** This needs to be done because without this trick tRPC will not be able to work with form data. */
app.addHook("preHandler", (req, _res, done) => {
  if (req.isMultipart()) {
    req.body2 = req.body;
    req.body = undefined;
  }
  done();
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
