import type { z } from "zod";

import { trpcInstance } from "./instance";

import type { Session } from "~/core";

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

  let session: Session | null = null;

  const sessionCookie = req.cookies[cookieName];

  if (typeof sessionCookie === "string") {
    const result = req.unsignCookie(sessionCookie);

    if (result.valid) {
      const eitherSession = await sessionsService.findOne({ id: result.value });
      if (eitherSession._tag === "Right") {
        session = eitherSession.right;
      }
    }
  }

  return next({
    ctx: {
      session,
    },
  });
});

export { processFormData, sessionMiddleware };
