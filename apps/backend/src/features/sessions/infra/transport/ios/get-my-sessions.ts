import { createPageSchema, zPageOptions } from "@tic-tac-toe/core";
import { z } from "zod";

import { zSession } from "~/core";

const zGetMySessionsIn = zPageOptions;
type GetMySessionsIn = z.infer<typeof zGetMySessionsIn>;

const zMySession = zSession
  .pick({
    id: true,
    ip: true,
    geolocation: true,
    device: true,
    os: true,
    browser: true,
    lastAccessedAt: true,
  })
  .extend({
    isCurrent: z.boolean(),
  });
type MySession = z.infer<typeof zMySession>;

const zGetMySessionsOut = createPageSchema(zMySession);
type GetMySessionsOut = z.infer<typeof zGetMySessionsOut>;

export { zGetMySessionsIn, zGetMySessionsOut, zMySession };
export type { GetMySessionsIn, GetMySessionsOut, MySession };
