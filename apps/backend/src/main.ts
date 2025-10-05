import { fastifyAwilixPlugin } from "@fastify/awilix";
import fastifyCookie from "@fastify/cookie";
import fastifyCors from "@fastify/cors";
import fastifyMultipart from "@fastify/multipart";
import { fastifySchedule } from "@fastify/schedule";
import { SLASH } from "@tic-tac-toe/core";
import type { FastifyTRPCPluginOptions } from "@trpc/server/adapters/fastify";
import { fastifyTRPCPlugin } from "@trpc/server/adapters/fastify";
import { asFunction, Lifetime } from "awilix";
import closeWithGrace from "close-with-grace";
import { config as dotenvConfig } from "dotenv";
import { expand } from "dotenv-expand";
import fastify from "fastify";

import { authRouter } from "./features/auth";
import { sessionsRouter } from "./features/sessions/infra/transport";
import { usersRouter } from "./features/users/infra/transport";
import type { Dependencies } from "./infra";
import { createConfig, createDiContainer, createTrpcContext, trpcRouter } from "./infra";

declare module "fastify" {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface FastifyRequest {
    body2: FastifyRequest["body"];
  }
}

declare module "@fastify/awilix" {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions, @typescript-eslint/no-empty-object-type
  interface Cradle extends Dependencies {}
}

const appRouter = trpcRouter({
  auth: authRouter,
  users: usersRouter,
  sessions: sessionsRouter,
});
type AppRouter = typeof appRouter;

expand(dotenvConfig());
const eitherConfig = createConfig(process.env);
if (eitherConfig._tag === "Left") {
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

const container = createDiContainer(config, app.log);
container.register({
  scheduler: asFunction(() => app.scheduler, {
    lifetime: Lifetime.SINGLETON,
  }),
});

app.register(fastifyAwilixPlugin, {
  container,
});

app.register(fastifySchedule);

app.register(fastifyCors, config.cors);

const {
  cookie: { secret, domain, secure },
} = config;
app.register(fastifyCookie, {
  secret,
  hook: "onRequest",
  parseOptions: {
    domain,
    httpOnly: true,
    path: SLASH,
    sameSite: "strict",
    secure,
    signed: true,
  },
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
    createContext: (opts) => {
      const {
        config,
        eventBus,
        usersService,
        sessionsService,
        getGeolocationByIp,
        parseUserAgent,
      } = opts.req.diScope.cradle;
      return createTrpcContext({
        ...opts,
        config,
        eventBus,
        usersService,
        sessionsService,
        getGeolocationByIp,
        parseUserAgent,
      });
    },
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
  app: { address, port },
} = config;
app.listen(
  {
    host: address,
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
