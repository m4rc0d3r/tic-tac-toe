import type { GetMySessionsOut } from "./ios";
import { zDeleteOneIn, zGetMySessionsIn, zGetMySessionsOut } from "./ios";

import { toTrpcError, trpcProcedureWithAuth, trpcRouter } from "~/infra";

const sessionsRouter = trpcRouter({
  updateLastAccessDate: trpcProcedureWithAuth.mutation(async (opts) => {
    const {
      ctx: {
        sessionsService,
        session: { id },
      },
    } = opts;

    const updateResult = await sessionsService.updateLastAccessDate({
      id,
    });

    if (updateResult._tag === "Left") {
      throw toTrpcError(updateResult.left);
    }

    const { lastAccessedAt } = updateResult.right;
    return {
      lastAccessedAt,
    };
  }),
  deleteOne: trpcProcedureWithAuth.input(zDeleteOneIn).mutation(async (opts) => {
    const {
      ctx: {
        sessionsService,
        session: { id: initiatingSessionId },
      },
      input,
    } = opts;

    const { id } = input;

    const resultOfDeletion = await sessionsService.deleteOne({
      id,
      initiatingSessionId,
    });

    if (resultOfDeletion._tag === "Left") {
      throw toTrpcError(resultOfDeletion.left);
    }
  }),

  deleteMySessions: trpcProcedureWithAuth.mutation(async (opts) => {
    const {
      ctx: {
        sessionsService,
        session: { id: initiatingSessionId },
      },
    } = opts;

    const resultOfDeletion = await sessionsService.deleteOtherUserSessions({
      initiatingSessionId,
    });

    if (resultOfDeletion._tag === "Left") {
      throw toTrpcError(resultOfDeletion.left);
    }
  }),

  getMySessions: trpcProcedureWithAuth.input(zGetMySessionsIn).query(async (opts) => {
    const {
      ctx: {
        sessionsService,
        session: { id: currentSessionId, userId },
      },
      input: pageOptions,
    } = opts;

    const searchResult = await sessionsService.list({
      filter: { userId },
      pageOptions,
    });

    return zGetMySessionsOut.parse({
      ...searchResult,
      data: searchResult.data.map((value) => ({
        ...value,
        isCurrent: value.id === currentSessionId,
      })),
    } satisfies GetMySessionsOut);
  }),
});

export { sessionsRouter };
