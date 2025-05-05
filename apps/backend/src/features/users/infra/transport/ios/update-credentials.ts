import type { z } from "zod";

import { zFullyRegisteredUser } from "~/core";

const zUpdateCredentialsIn = zFullyRegisteredUser
  .pick({
    email: true,
    password: true,
  })
  .partial()
  .extend({
    currentPassword: zFullyRegisteredUser.shape.password,
  });
type UpdateCredentialsIn = z.infer<typeof zUpdateCredentialsIn>;

const zUpdateCredentialsOut = zFullyRegisteredUser.pick({
  id: true,
  email: true,
});
type UpdateCredentialsOut = z.infer<typeof zUpdateCredentialsOut>;

export { zUpdateCredentialsIn, zUpdateCredentialsOut };
export type { UpdateCredentialsIn, UpdateCredentialsOut };
