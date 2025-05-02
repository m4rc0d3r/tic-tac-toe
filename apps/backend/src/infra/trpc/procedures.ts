import { toTrpcError } from "./error-handling";
import { trpcInstance } from "./instance";
import { sessionMiddleware } from "./middleware";
import { middlewareWithTracing } from "./tracing";

const trpcProcedure = trpcInstance.procedure;

const trpcProcedureWithAuth = trpcProcedure.use(sessionMiddleware).use(
  middlewareWithTracing(async (opts) => {
    const {
      ctx: { eitherSession },
      next,
    } = opts;

    if (eitherSession._tag === "Left") {
      throw toTrpcError(eitherSession.left);
    }

    return next({
      ctx: {
        session: eitherSession.right,
      },
    });
  }, "authenticate user"),
);

export { trpcProcedure, trpcProcedureWithAuth };
