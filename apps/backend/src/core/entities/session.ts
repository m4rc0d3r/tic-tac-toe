import { EMPTY_STRING, zBrowser, zDevice, zGeolocation, zOs } from "@tic-tac-toe/core";
import { z } from "zod";

import { zBasicUser } from "./user";

const SESSION_ID_LENGTH = 32;

const zSession = z.object({
  id: z.string().length(SESSION_ID_LENGTH),
  ip: z.string().ip().nullable(),
  geolocation: zGeolocation.nullable(),
  ua: z.string().default(EMPTY_STRING),
  device: zDevice.nullable(),
  os: zOs.nullable(),
  browser: zBrowser.nullable(),
  createdAt: z.date(),
  lastAccessedAt: z.date(),
  maximumAge: z.number().int().gt(0),
  userId: zBasicUser.shape.id,
});
type Session = z.infer<typeof zSession>;

export { SESSION_ID_LENGTH, zSession };
export type { Session };
