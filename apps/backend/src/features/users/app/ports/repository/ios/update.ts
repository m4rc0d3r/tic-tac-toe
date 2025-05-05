import { z } from "zod";

import { zCreateOut } from "./create";

import type { User } from "~/core";
import { zBasicUser, zFullyRegisteredUser, zNotFullyRegisteredUser } from "~/core";

const IN_SHARED_KEYS_TO_EXCLUDE = {
  registrationStatus: true,
} as const satisfies Partial<Record<keyof User, true>>;

const zUpdateNotFullyRegisteredIn = zNotFullyRegisteredUser
  .omit({
    ...IN_SHARED_KEYS_TO_EXCLUDE,
  })
  .partial()
  .merge(
    zBasicUser.pick({
      id: true,
    }),
  );

const zUpdateFullyRegisteredIn = zFullyRegisteredUser
  .omit({
    ...IN_SHARED_KEYS_TO_EXCLUDE,
    password: true,
  })
  .partial()
  .merge(
    zBasicUser.pick({
      id: true,
    }),
  );

const zUpdateIn = z.union([zUpdateNotFullyRegisteredIn, zUpdateFullyRegisteredIn]);
type UpdateIn = z.infer<typeof zUpdateIn>;

const zUpdateOut = zCreateOut;
type UpdateOut = z.infer<typeof zUpdateOut>;

export { zUpdateFullyRegisteredIn, zUpdateIn, zUpdateNotFullyRegisteredIn, zUpdateOut };
export type { UpdateIn, UpdateOut };
