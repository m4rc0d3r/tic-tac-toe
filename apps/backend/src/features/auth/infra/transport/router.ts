import type { FastifyReply } from "fastify";

import type { AuthService } from "../../app";
import type { PayloadToSign } from "../../app/service";

import { AuthenticationError } from "./errors";
import type { LoginOut, RefreshOut, RegisterOut } from "./ios";
import { zLoginIn, zRefreshIn, zRegisterIn } from "./ios";

import { procedureWithTracing, toTrpcError, trpcProcedure, trpcRouter } from "~/infra";

const authRouter = trpcRouter({
  register: trpcProcedure.input(zRegisterIn).mutation(
    procedureWithTracing(async (opts): Promise<RegisterOut> => {
      const {
        ctx: {
          res,
          config: {
            authentication: { refreshTokenCookieName },
            frontendApp,
          },
          usersService,
          authService,
        },
        input,
      } = opts;

      const resultOfCreation = await usersService.create(input);

      if (resultOfCreation._tag === "Left") {
        throw toTrpcError(resultOfCreation.left);
      }

      const { passwordHash, ...me } = resultOfCreation.right;

      return {
        accessToken: await setUpAuthentication(res, authService, resultOfCreation.right.id, {
          name: refreshTokenCookieName,
          domain: frontendApp.address,
        }),
        me,
      };
    }),
  ),

  login: trpcProcedure.input(zLoginIn).mutation(
    procedureWithTracing(async (opts): Promise<LoginOut> => {
      const {
        ctx: {
          res,
          config: {
            authentication: { refreshTokenCookieName },
            frontendApp,
          },
          usersService,
          authService,
        },
        input: { email, password },
      } = opts;

      const searchResult = await usersService.findOneBy({
        email,
        password,
      });

      if (searchResult._tag === "Left") {
        throw toTrpcError(searchResult.left);
      }

      const { passwordHash, ...me } = searchResult.right;

      return {
        accessToken: await setUpAuthentication(res, authService, searchResult.right.id, {
          name: refreshTokenCookieName,
          domain: frontendApp.address,
        }),
        me,
      };
    }),
  ),

  logout: trpcProcedure.mutation(
    procedureWithTracing((opts) => {
      const {
        ctx: {
          res,
          config: {
            authentication: { refreshTokenCookieName },
          },
        },
      } = opts;

      res.clearCookie(refreshTokenCookieName);
    }),
  ),

  refresh: trpcProcedure.input(zRefreshIn).mutation(
    procedureWithTracing(async (opts): Promise<RefreshOut> => {
      const {
        ctx: {
          req,
          res,
          config: {
            authentication: { refreshTokenCookieName },
            frontendApp,
          },
          usersService,
          authService,
        },
        input: { extendSession },
      } = opts;

      const token = req.cookies[refreshTokenCookieName];

      if (!token) {
        throw toTrpcError(
          new AuthenticationError({
            inBrief: "INVALID_REQUEST",
            inDetail: "MISSING_AUTHENTICATION_COOKIE",
          }),
        );
      }

      const checkResult = await authService.checkToken({
        type: "refresh",
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

      const { userId: id } = checkResult.right;

      const searchResult = await usersService.findOneBy({
        id,
      });

      if (searchResult._tag === "Left") {
        throw toTrpcError(searchResult.left);
      }

      const { passwordHash, ...me } = searchResult.right;

      const accessToken = extendSession
        ? await setUpAuthentication(res, authService, checkResult.right.userId, {
            name: refreshTokenCookieName,
            domain: frontendApp.address,
          })
        : (
            await authService.regenerateAccessToken({
              payload: checkResult.right,
            })
          ).token;

      return {
        accessToken,
        me,
      };
    }),
  ),
});

async function setUpAuthentication(
  res: FastifyReply,
  authService: AuthService,
  userId: PayloadToSign["userId"],
  refreshTokenCookie: {
    name: string;
    domain: string;
  },
) {
  const tokenMap = await authService.generateTokens({
    payload: {
      userId,
    },
  });

  const { name, domain } = refreshTokenCookie;
  const { token: refreshToken, payload } = tokenMap.refresh;
  res.setCookie(name, refreshToken, {
    expires: new Date(payload.exp),
    maxAge: payload.exp - payload.iat,
    domain,
    path: "/",
    secure: true,
    httpOnly: true,
    sameSite: "strict",
  });

  const accessToken = tokenMap.access.token;

  return accessToken;
}

export { authRouter };
