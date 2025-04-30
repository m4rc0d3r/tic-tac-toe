import { EMPTY_STRING } from "@tic-tac-toe/core";
import { z } from "zod";

import { zUser } from "./user";

const SESSION_ID_LENGTH = 32;

const zSession = z.object({
  id: z.string().length(SESSION_ID_LENGTH),
  ip: z.string().ip().nullable(),
  ua: z.string().default(EMPTY_STRING),
  os: z.string().default(EMPTY_STRING),
  browser: z.string().default(EMPTY_STRING),
  createdAt: z.date(),
  maximumAge: z.number().int().gt(0),
  userId: zUser.shape.id,
});
type Session = z.infer<typeof zSession>;

export { SESSION_ID_LENGTH, zSession };
export type { Session };
