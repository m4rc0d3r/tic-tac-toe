import type { z } from "zod";

import { zUser } from "~/core";
import { zUpdateOut } from "~/features/users/app/ports/repository";

const zUpdateCredentialsIn = zUser
  .pick({
    email: true,
    password: true,
  })
  .partial()
  .extend({
    currentPassword: zUser.shape.password,
  });
type UpdateCredentialsIn = z.infer<typeof zUpdateCredentialsIn>;

const zUpdateCredentialsOut = zUpdateOut.pick({
  id: true,
  email: true,
});
type UpdateCredentialsOut = z.infer<typeof zUpdateCredentialsOut>;

export { zUpdateCredentialsIn, zUpdateCredentialsOut };
export type { UpdateCredentialsIn, UpdateCredentialsOut };
