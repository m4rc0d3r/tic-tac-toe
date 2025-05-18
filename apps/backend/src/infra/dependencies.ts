import { PrismaClient } from "@prisma/client";
import { freeIpApi, ipWhoIs, uaParserJs } from "@tic-tac-toe/core";

import type { Config } from "./config";

import { PrismaSessionsRepository, SessionsService } from "~/features/sessions";
import {
  BcryptHashingService,
  PrismaUsersRepository,
  UsersService,
  VercelBlobService,
} from "~/features/users";

function createDependencies(config: Config) {
  const prisma = new PrismaClient();

  const usersRepository = new PrismaUsersRepository(prisma);
  const hashingService = new BcryptHashingService(config);
  const blobService = new VercelBlobService(config);
  const sessionsRepository = new PrismaSessionsRepository(prisma);

  const usersService = new UsersService(usersRepository, hashingService, blobService);
  const sessionsService = new SessionsService(config, sessionsRepository);

  const getGeolocationByIp = config.app.geolocationByIpProvider === "ipwhois" ? ipWhoIs : freeIpApi;
  const parseUserAgent = uaParserJs;

  return {
    config,
    usersService,
    sessionsService,
    getGeolocationByIp,
    parseUserAgent,
  };
}

export { createDependencies };
