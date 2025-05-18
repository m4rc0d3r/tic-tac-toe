import { PrismaClient } from "@prisma/client";
import type { AnyFunction, GetGeolocationByIp, UserAgentParserFunction } from "@tic-tac-toe/core";
import { freeIpApi, hasMethod, ipWhoIs, uaParserJs } from "@tic-tac-toe/core";
import type {
  AwilixContainer,
  BuildResolver,
  BuildResolverOptions,
  Constructor,
  DisposableResolver,
} from "awilix";
import { asClass, asFunction, asValue, createContainer, Lifetime } from "awilix";
import type { FastifyBaseLogger } from "fastify";
import type { ToadScheduler } from "toad-scheduler";

import type { Config } from "./config";

import { PrismaSessionsRepository, SessionsService } from "~/features/sessions";
import {
  BcryptHashingService,
  PrismaUsersRepository,
  UsersService,
  VercelBlobService,
} from "~/features/users";

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
interface AsyncInit {
  asyncInit(diContainer: AwilixContainer): Promise<unknown>;
}
// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
interface AsyncDispose {
  asyncDispose(): Promise<unknown>;
}

type Dependencies = {
  config: Config;
  logger: FastifyBaseLogger;
  scheduler: ToadScheduler;
  prisma: PrismaClient;

  usersRepository: PrismaUsersRepository;
  hashingService: BcryptHashingService;
  blobService: VercelBlobService;
  sessionsRepository: PrismaSessionsRepository;

  usersService: UsersService;
  sessionsService: SessionsService;

  getGeolocationByIp: GetGeolocationByIp;
  parseUserAgent: UserAgentParserFunction;
};

function createDiContainer(config: Config, logger: FastifyBaseLogger) {
  const PRISMA_CLIENT_CLASS_NAME = "PrismaClient";

  return createContainer<Dependencies>({
    injectionMode: "CLASSIC",
    strict: true,
  }).register({
    config: asValue(config),
    logger: asValue(logger),
    prisma: asFunction(() => new PrismaClient(), {
      lifetime: Lifetime.SINGLETON,
      asyncInit: async (instance) => {
        const startTime = performance.now();
        await instance.$connect();
        logger.debug(
          createLifecycleMessage(PRISMA_CLIENT_CLASS_NAME, "INIT", performance.now() - startTime),
        );
      },
      asyncDispose: async (instance) => {
        const startTime = performance.now();
        await instance.$disconnect();
        logger.debug(
          createLifecycleMessage(
            PRISMA_CLIENT_CLASS_NAME,
            "DISPOSE",
            performance.now() - startTime,
          ),
        );
      },
    }),
    ...Object.fromEntries(
      (
        [
          ["usersRepository", PrismaUsersRepository],
          ["hashingService", BcryptHashingService],
          ["blobService", VercelBlobService],
          ["sessionsRepository", PrismaSessionsRepository],
          ["usersService", UsersService],
          ["sessionsService", SessionsService],
        ] as [string, Constructor<object>][]
      ).map(([key, value]) => [
        key,
        asClass2(value, {
          lifetime: Lifetime.SINGLETON,
          asyncInitWrapper: async (_instance, _diContainer, asyncInit) => {
            const startTime = performance.now();
            await asyncInit?.();
            logger.debug(createLifecycleMessage(value, "INIT", performance.now() - startTime));
          },
          asyncDisposeWrapper: async (_instance, asyncDispose) => {
            const startTime = performance.now();
            await asyncDispose?.();
            logger.debug(createLifecycleMessage(value, "DISPOSE", performance.now() - startTime));
          },
        }),
      ]),
    ),
    getGeolocationByIp: asFunction((config: Config) =>
      config.app.geolocationByIpProvider === "ipwhois" ? ipWhoIs : freeIpApi,
    ),
    parseUserAgent: asValue(uaParserJs),
  });
}

function createLifecycleMessage(
  value: Constructor<unknown> | string,
  lifeStage: "INIT" | "DISPOSE",
  elapsedTime: number,
) {
  return `An instance of '${typeof value === "string" ? value : value.name}' was ${lifeStage === "INIT" ? "initialized" : "disposed"} in ${Math.round(elapsedTime)}ms`;
}

function asClass2<T = object>(
  Type: Constructor<T>,
  opts?: Omit<BuildResolverOptions<T>, "asyncInit" | "asyncDispose"> & {
    asyncInitWrapper?:
      | (<U extends T>(
          instance: U,
          diContainer: AwilixContainer,
          asyncInit?: () => Promise<unknown>,
        ) => Promise<unknown>)
      | undefined;
    asyncDisposeWrapper?:
      | (<U extends T>(instance: U, asyncDispose?: () => Promise<unknown>) => Promise<unknown>)
      | undefined;
  },
): BuildResolver<T> & DisposableResolver<T> {
  const { asyncInitWrapper, asyncDisposeWrapper, ...opts_ } = opts ?? {};

  return asClass(Type, {
    asyncInit:
      typeof asyncInitWrapper === "function"
        ? ((async (instance, diContainer) => {
            await asyncInitWrapper(
              instance,
              diContainer,
              hasMethod(instance, "asyncInit")
                ? async () => (instance as AsyncInit).asyncInit(diContainer)
                : undefined,
            );
          }) satisfies Extract<BuildResolverOptions<T>["asyncInit"], AnyFunction>)
        : hasMethod(Type.prototype, "asyncInit"),
    asyncDispose:
      typeof asyncDisposeWrapper === "function"
        ? ((async (instance) => {
            await asyncDisposeWrapper(
              instance,
              hasMethod(instance, "asyncDispose")
                ? async () => (instance as AsyncDispose).asyncDispose()
                : undefined,
            );
          }) satisfies Extract<BuildResolverOptions<T>["asyncDispose"], AnyFunction>)
        : hasMethod(Type.prototype, "asyncDispose"),
    ...opts_,
  });
}

export { createDiContainer };
export type { AsyncDispose, AsyncInit, Dependencies };
