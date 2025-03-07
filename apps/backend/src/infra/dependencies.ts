import { PrismaClient } from "@prisma/client";
import type { FastifyBaseLogger } from "fastify";

import type { Config } from "./config";

import { AuthService, JwtServiceImpl } from "~/features/auth";
import { BcryptHashingService, PrismaUsersRepository, UsersService } from "~/features/users";
import { withMethodTracing } from "~/shared";

function createDependencies(config: Config, logger: FastifyBaseLogger) {
  const prisma = new PrismaClient();

  const usersRepository = new PrismaUsersRepository(prisma);
  const hashingService = new BcryptHashingService(config);
  const jwtService = new JwtServiceImpl(config);

  const usersService = new UsersService(usersRepository, hashingService);
  const authService = new AuthService(jwtService);

  if (config.app.nodeEnv === "dev") {
    withMethodTracing(usersRepository, logger);
    withMethodTracing(hashingService, logger);
    withMethodTracing(jwtService, logger);
    withMethodTracing(usersService, logger);
    withMethodTracing(authService, logger);
  }

  return {
    config,
    usersService,
    authService,
  };
}

export { createDependencies };
