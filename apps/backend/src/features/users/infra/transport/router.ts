import { UserUpdateError } from "./errors";
import type { UpdateCredentialsOut, UpdatePersonalDataOut } from "./ios";
import { zUpdateCredentialsIn, zUpdatePersonalDataIn } from "./ios";

import type { User } from "~/core";
import {
  procedureWithTracing,
  processFormData,
  toTrpcError,
  trpcProcedureWithAuth,
  trpcRouter,
} from "~/infra";

const usersRouter = trpcRouter({
  updatePersonalData: trpcProcedureWithAuth.use(processFormData(zUpdatePersonalDataIn)).mutation(
    procedureWithTracing(async (opts): Promise<UpdatePersonalDataOut> => {
      const {
        ctx: {
          usersService,
          session: { userId: id },
          input,
        },
      } = opts;

      const updateResult = await usersService.update({
        id,
        ...input,
      });

      if (updateResult._tag === "Left") {
        throw toTrpcError(updateResult.left);
      }

      const { passwordHash, ...me } = updateResult.right;

      return me;
    }),
  ),

  updateCredentials: trpcProcedureWithAuth.input(zUpdateCredentialsIn).mutation(
    procedureWithTracing(async (opts): Promise<UpdateCredentialsOut> => {
      const {
        ctx: {
          usersService,
          session: { userId: id },
        },
        input,
      } = opts;

      const { currentPassword: password, ...rest } = input;

      const searchResult = await usersService.findOneBy({
        id,
        password,
      });

      if (searchResult._tag === "Left") {
        if (
          ("password" satisfies Extract<keyof User, "password">) in searchResult.left.filterCriteria
        ) {
          throw toTrpcError(new UserUpdateError("INCORRECT_PASSWORD"));
        }
        throw toTrpcError(searchResult.left);
      }

      const updateResult = await usersService.update({
        id,
        ...rest,
      });

      if (updateResult._tag === "Left") {
        throw toTrpcError(updateResult.left);
      }

      const { passwordHash, ...me } = updateResult.right;

      return me;
    }),
  ),

  getMe: trpcProcedureWithAuth.query(
    procedureWithTracing(async (opts) => {
      const {
        ctx: {
          usersService,
          session: { userId: id },
        },
      } = opts;

      const searchResult = await usersService.findOneBy({
        id,
      });

      if (searchResult._tag === "Left") {
        throw toTrpcError(searchResult.left);
      }

      return searchResult.right;
    }),
  ),
});

export { usersRouter };
