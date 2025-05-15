import { zListByNicknameIn } from "../../app/ports/repository";

import { UserUpdateError } from "./errors";
import type { UpdateCredentialsOut, UpdatePersonalDataOut } from "./ios";
import {
  zGetUserIn,
  zGetUserOut,
  zGetUsersByNicknameOut,
  zUpdateCredentialsIn,
  zUpdatePersonalDataIn,
} from "./ios";

import type { FullyRegisteredUser } from "~/core";
import {
  procedureWithTracing,
  processFormData,
  toTrpcError,
  trpcProcedure,
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

      const updateResult = await usersService.updatePersonalData({
        id,
        ...input,
      });

      if (updateResult._tag === "Left") {
        throw toTrpcError(updateResult.left);
      }

      return updateResult.right;
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
          ("password" satisfies Extract<keyof FullyRegisteredUser, "password">) in
          searchResult.left.filterCriteria
        ) {
          throw toTrpcError(new UserUpdateError("INCORRECT_PASSWORD"));
        }
        throw toTrpcError(searchResult.left);
      }

      const updateResult = await usersService.updateCredentials({
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

  getUser: trpcProcedure.input(zGetUserIn).query(
    procedureWithTracing(async (opts) => {
      const {
        ctx: { usersService },
        input: { id },
      } = opts;

      const searchResult = await usersService.findOneWithLastOnlineDate({
        id,
      });

      if (searchResult._tag === "Left") {
        throw toTrpcError(searchResult.left);
      }

      return zGetUserOut.parse(searchResult.right);
    }),
  ),

  getUsersByNickname: trpcProcedure.input(zListByNicknameIn).query(
    procedureWithTracing(async (opts) => {
      const {
        ctx: { usersService },
        input,
      } = opts;

      return zGetUsersByNicknameOut.parse(await usersService.listByNickname(input));
    }),
  ),
});

export { usersRouter };
