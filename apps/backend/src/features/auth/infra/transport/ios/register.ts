import { z } from "zod";

import type { User } from "~/core";
import { USER_DISCRIMINATOR_KEY, zFullyRegisteredUser, zNotFullyRegisteredUser } from "~/core";

const IN_SHARED_KEYS_TO_EXCLUDE = {
  id: true,
  registrationStatus: true,
} as const satisfies Partial<Record<keyof User, true>>;

const REGISTRATION_TYPE = "registrationType";

const zPartialRegisterIn = zNotFullyRegisteredUser
  .omit({
    ...IN_SHARED_KEYS_TO_EXCLUDE,
  })
  .extend({
    [REGISTRATION_TYPE]: z.literal(zNotFullyRegisteredUser.shape[USER_DISCRIMINATOR_KEY].value),
  });
const zFullRegisterIn = zFullyRegisteredUser
  .omit({
    ...IN_SHARED_KEYS_TO_EXCLUDE,
    passwordHash: true,
  })
  .extend({
    [REGISTRATION_TYPE]: z.literal(zFullyRegisteredUser.shape[USER_DISCRIMINATOR_KEY].value),
  });

const zRegisterIn = z.discriminatedUnion(REGISTRATION_TYPE, [zPartialRegisterIn, zFullRegisterIn]);
type RegisterIn = z.infer<typeof zRegisterIn>;

const zRegisterOut = z.object({
  me: z.discriminatedUnion(USER_DISCRIMINATOR_KEY, [
    zNotFullyRegisteredUser,
    zFullyRegisteredUser.omit({
      password: true,
      passwordHash: true,
    }),
  ]),
});
type RegisterOut = z.infer<typeof zRegisterOut>;

export { zFullRegisterIn, zPartialRegisterIn, zRegisterIn, zRegisterOut };
export type { RegisterIn, RegisterOut };
