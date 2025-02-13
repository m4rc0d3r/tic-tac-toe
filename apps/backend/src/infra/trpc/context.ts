import type { CreateFastifyContextOptions } from "@trpc/server/adapters/fastify";

function createTrpcContext(opts: CreateFastifyContextOptions) {
  return opts;
}
type TrpcContext = Awaited<ReturnType<typeof createTrpcContext>>;

export { createTrpcContext };
export type { TrpcContext };
