import type { UserAgentParserFunction } from "@tic-tac-toe/core";
import type { FastifyReply, FastifyRequest } from "fastify";
import { getClientIp } from "request-ip";

import type { LoginOut, RegisterOut } from "./ios";
import { zLoginIn, zRegisterIn } from "./ios";

import type { Session, User } from "~/core";
import type { SessionsService } from "~/features/sessions";
import type { FindOneByOut } from "~/features/users/app/ports/repository";
import { procedureWithTracing, toTrpcError, trpcProcedure, trpcRouter } from "~/infra";

const authRouter = trpcRouter({
  register: trpcProcedure.input(zRegisterIn).mutation(
    procedureWithTracing(async (opts): Promise<RegisterOut> => {
      const {
        ctx: {
          req,
          res,
          config: {
            session: { cookieName },
          },
          usersService,
          sessionsService,
          parseUserAgent,
        },
        input: { registrationType, ...input },
      } = opts;

      const resultOfCreation = await usersService.create(input);

      if (resultOfCreation._tag === "Left") {
        throw toTrpcError(resultOfCreation.left);
      }

      const me = getUserWithoutPasswordHash(resultOfCreation.right);

      await setUpSession(req, res, sessionsService, parseUserAgent, cookieName, me.id);

      return {
        me,
      };
    }),
  ),

  login: trpcProcedure.input(zLoginIn).mutation(
    procedureWithTracing(async (opts): Promise<LoginOut> => {
      const {
        ctx: {
          req,
          res,
          config: {
            session: { cookieName },
          },
          usersService,
          sessionsService,
          parseUserAgent,
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

      const me = getUserWithoutPasswordHash(searchResult.right);

      await setUpSession(req, res, sessionsService, parseUserAgent, cookieName, me.id);

      return {
        me,
      };
    }),
  ),

  logout: trpcProcedure.mutation(
    procedureWithTracing(async (opts) => {
      const {
        ctx: {
          req,
          res,
          config: {
            session: { cookieName },
          },
          sessionsService,
        },
      } = opts;

      const sessionCookie = req.cookies[cookieName];

      if (typeof sessionCookie !== "string") {
        return;
      }

      const result = req.unsignCookie(sessionCookie);

      if (!result.valid) {
        return;
      }

      await destroySession(res, sessionsService, cookieName, result.value);
    }),
  ),
});

function getUserWithoutPasswordHash(user: FindOneByOut) {
  if (user.registrationStatus === "FULL") {
    const { passwordHash, ...rest } = user;
    return rest;
  } else {
    return user;
  }
}

async function setUpSession(
  req: FastifyRequest,
  res: FastifyReply,
  sessionsService: SessionsService,
  parseUserAgent: UserAgentParserFunction,
  cookieName: string,
  userId: User["id"],
) {
  const eitherSession = await createSession(req, sessionsService, parseUserAgent, userId);
  if (eitherSession._tag === "Right") {
    setSessionCookie(res, eitherSession.right, cookieName);
  } else {
    throw toTrpcError(new Error("Failed to create session."));
  }
}

async function createSession(
  req: FastifyRequest,
  sessionsService: SessionsService,
  parseUserAgent: UserAgentParserFunction,
  userId: User["id"],
) {
  const ip = getClientIp(req);
  const ua = req.headers["user-agent"] ?? "";

  return sessionsService.createOne({
    ua,
    ip,
    userId,
    ...parseUserAgent(ua),
  });
}

function setSessionCookie(res: FastifyReply, session: Session, cookieName: string) {
  const MILLISECONDS_PER_SECOND = 1000;

  const maxAge = Math.round(
    (session.createdAt.getTime() + session.maximumAge - Date.now()) / MILLISECONDS_PER_SECOND,
  );

  res.setCookie(cookieName, session.id, {
    maxAge,
  });
}

async function destroySession(
  res: FastifyReply,
  sessionsService: SessionsService,
  cookieName: string,
  id: Session["id"],
) {
  await sessionsService.deleteOne({
    id,
    initiatingSessionId: id,
  });
  clearSessionCookie(res, cookieName);
}

function clearSessionCookie(res: FastifyReply, cookieName: string) {
  res.clearCookie(cookieName);
}

export { authRouter };
