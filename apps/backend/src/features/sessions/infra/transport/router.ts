import type { GetMySessionsOut } from "./ios";
import { zDeleteMySessionsIn, zDeleteOneIn, zGetMySessionsIn, zGetMySessionsOut } from "./ios";

import { procedureWithTracing, toTrpcError, trpcProcedureWithAuth, trpcRouter } from "~/infra";

const sessionsRouter = trpcRouter({
  deleteOne: trpcProcedureWithAuth.input(zDeleteOneIn).mutation(
    procedureWithTracing(async (opts) => {
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
  ),

  deleteMySessions: trpcProcedureWithAuth.input(zDeleteMySessionsIn).mutation(
    procedureWithTracing(async (opts) => {
      const {
        ctx: {
          sessionsService,
          session: { id: initiatingSessionId },
        },
        input,
      } = opts;

      const { deleteMode } = input;

      const resultOfDeletion = await sessionsService.deleteUserSessions({
        initiatingSessionId,
        deleteMode,
      });

      if (resultOfDeletion._tag === "Left") {
        throw toTrpcError(resultOfDeletion.left);
      }
    }),
  ),

  getMySessions: trpcProcedureWithAuth.input(zGetMySessionsIn).query(
    procedureWithTracing(async (opts) => {
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
  ),
});

export { sessionsRouter };
