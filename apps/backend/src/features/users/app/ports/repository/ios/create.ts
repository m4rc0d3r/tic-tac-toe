import { z } from "zod";

import type { User } from "~/core";
import { USER_DISCRIMINATOR_KEY, zFullyRegisteredUser, zNotFullyRegisteredUser } from "~/core";

const IN_SHARED_KEYS_TO_EXCLUDE = {
  id: true,
  registrationStatus: true,
} as const satisfies Partial<Record<keyof User, true>>;

const zCreateIn = z.union([
  zNotFullyRegisteredUser.omit({
    ...IN_SHARED_KEYS_TO_EXCLUDE,
  }),
  zFullyRegisteredUser.omit({
    ...IN_SHARED_KEYS_TO_EXCLUDE,
    password: true,
  }),
]);
type CreateIn = z.infer<typeof zCreateIn>;

const zCreateOut = z.discriminatedUnion(USER_DISCRIMINATOR_KEY, [
  zNotFullyRegisteredUser,
  zFullyRegisteredUser.omit({
    password: true,
  }),
]);
type CreateOut = z.infer<typeof zCreateOut>;

export { zCreateIn, zCreateOut };
export type { CreateIn, CreateOut };
