import { PrismaClient } from "@prisma/client";

import type { Config } from "./config";

import { AuthService, JwtServiceImpl } from "~/features/auth";
import { BcryptHashingService, PrismaUsersRepository, UsersService } from "~/features/users";

function createDependencies(config: Config) {
  const prisma = new PrismaClient();

  const usersRepository = new PrismaUsersRepository(prisma);
  const hashingService = new BcryptHashingService(config);
  const jwtService = new JwtServiceImpl(config);

  const usersService = new UsersService(usersRepository, hashingService);
  const authService = new AuthService(jwtService);

  return {
    config,
    usersService,
    authService,
  };
}

export { createDependencies };
