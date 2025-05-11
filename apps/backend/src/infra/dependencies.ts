import { PrismaClient } from "@prisma/client";
import { uaParserJs } from "@tic-tac-toe/core";
import type { FastifyBaseLogger } from "fastify";

import type { Config } from "./config";

import { PrismaSessionsRepository, SessionsService } from "~/features/sessions";
import {
  BcryptHashingService,
  PrismaUsersRepository,
  UsersService,
  VercelBlobService,
} from "~/features/users";
import { withMethodTracing } from "~/shared";

function createDependencies(config: Config, logger: FastifyBaseLogger) {
  const prisma = new PrismaClient();

  const usersRepository = new PrismaUsersRepository(prisma);
  const hashingService = new BcryptHashingService(config);
  const blobService = new VercelBlobService(config);
  const sessionsRepository = new PrismaSessionsRepository(prisma);

  const usersService = new UsersService(usersRepository, hashingService, blobService);
  const sessionsService = new SessionsService(config, sessionsRepository);

  const parseUserAgent = uaParserJs;

  if (config.app.nodeEnv === "dev") {
    withMethodTracing(usersRepository, logger);
    withMethodTracing(hashingService, logger);
    withMethodTracing(sessionsRepository, logger);
    withMethodTracing(usersService, logger);
    withMethodTracing(sessionsService, logger);
  }

  return {
    config,
    usersService,
    sessionsService,
    parseUserAgent,
  };
}

export { createDependencies };
