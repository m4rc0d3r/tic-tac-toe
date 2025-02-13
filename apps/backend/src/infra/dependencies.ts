import { PrismaClient } from "@prisma/client";
import { either as e, function as f } from "fp-ts";

import { createConfig } from "./config";

import { AuthService, JwtServiceImpl } from "~/features/auth";
import { BcryptHashingService, PrismaUsersRepository, UsersService } from "~/features/users";

function createDependencies(environment: Record<string, unknown>) {
  const eitherConfig = createConfig(environment);

  return f.pipe(
    eitherConfig,
    e.map((config) => {
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
    }),
  );
}

export { createDependencies };
