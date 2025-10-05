import { initTRPC } from "@trpc/server";
import superjson from "superjson";

import type { TrpcContext } from "./context";
import { formatTrpcError } from "./error-handling";

const trpcInstance = initTRPC.context<TrpcContext>().create({
  errorFormatter: (opts) => {
    const { error, path } = opts;
    const { stack } = error;

    return formatTrpcError(error, path, stack);
  },
  transformer: superjson,
});

export { trpcInstance };
