import { initTRPC } from "@trpc/server";

import type { TrpcContext } from "./context";
import { formatTrpcError } from "./error-handling";

const trpcInstance = initTRPC.context<TrpcContext>().create({
  errorFormatter: (opts) => {
    const { error, path } = opts;
    const { stack } = error;

    return formatTrpcError(error, path, stack);
  },
});

export { trpcInstance };
