import type { CookieSerializeOptions } from "@fastify/cookie";
import type { FastifyReply, FastifyRequest } from "fastify";
import { getClientIp } from "request-ip";
import { UAParser } from "ua-parser-js";

import type { AuthService } from "../../app";
import type { PayloadToSign } from "../../app/service";

import { AuthenticationError } from "./errors";
import type { LoginOut, RefreshOut, RegisterOut } from "./ios";
import { zLoginIn, zRefreshIn, zRegisterIn } from "./ios";

import type { Session, User } from "~/core";
import type { SessionsService } from "~/features/sessions";
import type { Config } from "~/infra";
import { procedureWithTracing, toTrpcError, trpcProcedure, trpcRouter } from "~/infra";

const authRouter = trpcRouter({
  register: trpcProcedure.input(zRegisterIn).mutation(
    procedureWithTracing(async (opts): Promise<RegisterOut> => {
      const {
        ctx: { req, res, config, usersService, authService, sessionsService },
        input,
      } = opts;

      const {
        authentication: { refreshTokenCookieName },
        frontendApp,
      } = config;

      const resultOfCreation = await usersService.create(input);

      if (resultOfCreation._tag === "Left") {
        throw toTrpcError(resultOfCreation.left);
      }

      const { passwordHash, ...me } = resultOfCreation.right;

      await setUpSession(req, res, sessionsService, config, me.id);

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
        ctx: { req, res, config, usersService, authService, sessionsService },
        input: { email, password },
      } = opts;

      const {
        authentication: { refreshTokenCookieName },
        frontendApp,
      } = config;

      const searchResult = await usersService.findOneBy({
        email,
        password,
      });

      if (searchResult._tag === "Left") {
        throw toTrpcError(searchResult.left);
      }

      const { passwordHash, ...me } = searchResult.right;

      await setUpSession(req, res, sessionsService, config, me.id);

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
    procedureWithTracing(async (opts) => {
      const {
        ctx: { req, res, config, sessionsService },
      } = opts;

      const {
        authentication: { refreshTokenCookieName },
        session: { cookieName },
      } = config;

      res.clearCookie(refreshTokenCookieName);

      const sessionCookie = req.cookies[cookieName];

      if (typeof sessionCookie !== "string") {
        return;
      }

      const result = req.unsignCookie(sessionCookie);

      if (!result.valid) {
        return;
      }

      await destroySession(res, config, sessionsService, result.value);
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

async function setUpSession(
  req: FastifyRequest,
  res: FastifyReply,
  sessionsService: SessionsService,
  config: Config,
  userId: User["id"],
) {
  const eitherSession = await createSession(req, sessionsService, userId);
  if (eitherSession._tag === "Right") {
    setSessionCookie(res, eitherSession.right, config);
  } else {
    throw toTrpcError(new Error("Failed to create session."));
  }
}

async function createSession(
  req: FastifyRequest,
  sessionsService: SessionsService,
  userId: User["id"],
) {
  const ip = getClientIp(req);
  const { browser, os } = UAParser(req.headers["user-agent"]);

  return sessionsService.createOne({
    browser: browser.toString(),
    geolocation: "",
    ip,
    os: os.toString(),
    userId,
  });
}

const COOKIE_OPTIONS: CookieSerializeOptions = {
  path: "/",
  secure: true,
  httpOnly: true,
  sameSite: "strict",
  signed: true,
};

function setSessionCookie(res: FastifyReply, session: Session, config: Config) {
  const MILLISECONDS_PER_SECOND = 1000;
  const {
    cookie: { domain },
    session: { cookieName },
  } = config;

  const maxAge = Math.round(
    (session.createdAt.getTime() + session.maximumAge - Date.now()) / MILLISECONDS_PER_SECOND,
  );

  res.setCookie(cookieName, session.id, {
    maxAge,
    domain,
    ...COOKIE_OPTIONS,
  });
}

async function destroySession(
  res: FastifyReply,
  config: Config,
  sessionsService: SessionsService,
  id: Session["id"],
) {
  await sessionsService.deleteOne({
    id,
    initiatingSessionId: id,
  });
  clearSessionCookie(res, config);
}

function clearSessionCookie(res: FastifyReply, config: Config) {
  res.clearCookie(config.session.cookieName);
}

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
    ...COOKIE_OPTIONS,
    signed: false,
  });

  const accessToken = tokenMap.access.token;

  return accessToken;
}

export { authRouter };
