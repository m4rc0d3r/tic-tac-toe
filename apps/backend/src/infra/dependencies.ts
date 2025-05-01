import { PrismaClient } from "@prisma/client";
import type { FastifyBaseLogger } from "fastify";

import type { Config } from "./config";

import { AuthService, JwtServiceImpl } from "~/features/auth";
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
  const jwtService = new JwtServiceImpl(config);
  const blobService = new VercelBlobService(config);
  const sessionsRepository = new PrismaSessionsRepository(prisma);

  const usersService = new UsersService(usersRepository, hashingService, blobService);
  const authService = new AuthService(jwtService);
  const sessionsService = new SessionsService(config, sessionsRepository);

  if (config.app.nodeEnv === "dev") {
    withMethodTracing(usersRepository, logger);
    withMethodTracing(hashingService, logger);
    withMethodTracing(jwtService, logger);
    withMethodTracing(sessionsRepository, logger);
    withMethodTracing(usersService, logger);
    withMethodTracing(authService, logger);
    withMethodTracing(sessionsService, logger);
  }

  return {
    config,
    usersService,
    authService,
    sessionsService,
  };
}

export { createDependencies };
