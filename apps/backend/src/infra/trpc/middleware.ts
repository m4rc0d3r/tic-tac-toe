import type { z } from "zod";

import { trpcInstance } from "./instance";

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

export { processFormData };
