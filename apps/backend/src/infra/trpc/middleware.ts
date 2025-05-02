import { either as e, function as f } from "fp-ts";
import type { z } from "zod";

import { trpcInstance } from "./instance";

import { AuthenticationError } from "~/features/auth";
import { isSessionExpired } from "~/features/sessions";

function processFormData<Schema extends z.ZodSchema<unknown>>(
  schema: Parameters<typeof trpcInstance.procedure.input<Schema>>[0],
) {
  return trpcInstance.middleware<{
    input: z.infer<Schema>;
  }>(async (opts) => {
    const {
      ctx: { req },
      next,
    } = opts;

    if (req.isMultipart()) {
      req.body = req.body2;
      req.body2 = undefined;
    }

    return next({
      ctx: {
        input: schema.parse(await req.formData()),
      },
    });
  });
}

const sessionMiddleware = trpcInstance.middleware(async (opts) => {
  const {
    ctx: { req, config, sessionsService },
    next,
  } = opts;

  const {
    session: { cookieName },
  } = config;

  type Session = Extract<
    Awaited<ReturnType<(typeof sessionsService)["findOne"]>>,
    e.Right<unknown>
  >["right"];

  let eitherSession: e.Either<AuthenticationError, Session> = e.left(
    new AuthenticationError("NO_DATA"),
  );

  const sessionCookie = req.cookies[cookieName];
  if (typeof sessionCookie === "string") {
    const result = req.unsignCookie(sessionCookie);
    eitherSession = result.valid
      ? f.pipe(
          await sessionsService.findOne({
            id: result.value,
          }),
          e.mapLeft(() => new AuthenticationError("DATA_IS_MISSING_FROM_STORAGE")),
          e.flatMap((session) =>
            f.pipe(
              session,
              e.fromPredicate(
                (session) => !isSessionExpired(session),
                () => new AuthenticationError("DATA_IS_EXPIRED"),
              ),
            ),
          ),
        )
      : e.left(new AuthenticationError("INCORRECT_DATA"));
  }

  return next({
    ctx: {
      eitherSession,
    },
  });
});

export { processFormData, sessionMiddleware };
