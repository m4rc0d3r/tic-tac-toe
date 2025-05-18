import type { GetGeolocationByIp, UserAgentParserFunction } from "@tic-tac-toe/core";
import type { CreateFastifyContextOptions } from "@trpc/server/adapters/fastify";

import type { Config } from "../config";

import type { SessionsService } from "~/features/sessions";
import type { UsersService } from "~/features/users";

type CreateTrpcInternalContextOptions = {
  config: Config;
  usersService: UsersService;
  sessionsService: SessionsService;
  getGeolocationByIp: GetGeolocationByIp;
  parseUserAgent: UserAgentParserFunction;
};

function createTrpcInternalContext(opts: CreateTrpcInternalContextOptions) {
  return opts;
}
type TrpcInternalContext = ReturnType<typeof createTrpcInternalContext>;

function createTrpcContext({
  req,
  res,
  ...internalContextOptions
}: CreateFastifyContextOptions & CreateTrpcInternalContextOptions) {
  return {
    req,
    res,
    ...createTrpcInternalContext(internalContextOptions),
  };
}
type TrpcContext = Awaited<ReturnType<typeof createTrpcContext>>;

export { createTrpcContext, createTrpcInternalContext };
export type { TrpcContext, TrpcInternalContext };
