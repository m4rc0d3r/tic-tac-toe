import { SPACE } from "@tic-tac-toe/core";

import { toTrpcError } from "./error-handling";
import { trpcInstance } from "./instance";
import { middlewareWithTracing } from "./tracing";

import { AuthenticationError } from "~/features/auth";

const trpcProcedure = trpcInstance.procedure;

const trpcProcedureWithAuth = trpcProcedure.use(
  middlewareWithTracing(async (opts) => {
    const {
      ctx: { req, authService },
      next,
    } = opts;

    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader) {
      throw toTrpcError(
        new AuthenticationError({
          inBrief: "INVALID_REQUEST",
          inDetail: "AUTHORIZATION_HEADER_MISSING",
        }),
      );
    }

    const [scheme, token] = authorizationHeader.split(SPACE);

    if (!(scheme === "Bearer" && token)) {
      throw toTrpcError(
        new AuthenticationError({
          inBrief: "INVALID_REQUEST",
          inDetail: "AUTHORIZATION_HEADER_MALFORMED",
        }),
      );
    }

    const checkResult = await authService.checkToken({
      type: "access",
      token,
    });

    if (checkResult._tag === "Left") {
      throw toTrpcError(
        new AuthenticationError({
          inBrief: "INVALID_TOKEN",
          inDetail: checkResult.left,
        }),
      );
    }

    const { userId } = checkResult.right;

    return next({
      ctx: {
        userId,
      },
    });
  }, "authenticate user"),
);

export { trpcProcedure, trpcProcedureWithAuth };
