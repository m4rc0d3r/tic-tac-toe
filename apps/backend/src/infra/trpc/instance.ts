import { initTRPC } from "@trpc/server";

import type { TrpcContext } from "./context";

const trpcInstance = initTRPC.context<TrpcContext>().create();

export { trpcInstance };
