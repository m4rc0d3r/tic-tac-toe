import { z } from "zod";

import type { User } from "~/core";
import { zFullyRegisteredUser, zNotFullyRegisteredUser } from "~/core";

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
    passwordHash: true,
  }),
]);
type CreateIn = z.infer<typeof zCreateIn>;

export { zCreateIn };
export type { CreateIn };
