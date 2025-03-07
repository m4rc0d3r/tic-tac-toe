import type { CreateFastifyContextOptions } from "@trpc/server/adapters/fastify";

import type { createDependencies } from "../dependencies";

type CreateTrpcInternalContextOptions = ReturnType<typeof createDependencies>;

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
