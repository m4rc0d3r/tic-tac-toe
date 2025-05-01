import { toTrpcError } from "./error-handling";
import { trpcInstance } from "./instance";
import { sessionMiddleware } from "./middleware";
import { middlewareWithTracing } from "./tracing";

const trpcProcedure = trpcInstance.procedure;

const trpcProcedureWithAuth = trpcProcedure.use(sessionMiddleware).use(
  middlewareWithTracing(async (opts) => {
    const {
      ctx: { session },
      next,
    } = opts;

    if (session === null) {
      throw toTrpcError(new Error("The request does not contain session information."));
    }

    const { userId } = session;

    return next({
      ctx: {
        userId,
      },
    });
  }, "authenticate user"),
);

export { trpcProcedure, trpcProcedureWithAuth };
