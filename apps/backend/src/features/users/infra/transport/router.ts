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
  processFormData,
  toTrpcError,
  trpcProcedure,
  trpcProcedureWithAuth,
  trpcRouter,
} from "~/infra";

const usersRouter = trpcRouter({
  updatePersonalData: trpcProcedureWithAuth
    .use(processFormData(zUpdatePersonalDataIn))
    .mutation(async (opts): Promise<UpdatePersonalDataOut> => {
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

      {
        const { id, nickname, firstName, lastName, avatar } = updateResult.right;

        return {
          id,
          nickname,
          firstName,
          lastName,
          avatar,
        };
      }
    }),

  updateCredentials: trpcProcedureWithAuth
    .input(zUpdateCredentialsIn)
    .mutation(async (opts): Promise<UpdateCredentialsOut> => {
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

      {
        const { id, email } = updateResult.right;

        return {
          id,
          email,
        };
      }
    }),

  getMe: trpcProcedureWithAuth.query(async (opts) => {
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

  getUser: trpcProcedure.input(zGetUserIn).query(async (opts) => {
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

  getUsersByNickname: trpcProcedure.input(zListByNicknameIn).query(async (opts) => {
    const {
      ctx: { usersService },
      input,
    } = opts;

    return zGetUsersByNicknameOut.parse(await usersService.listByNickname(input));
  }),
});

export { usersRouter };
