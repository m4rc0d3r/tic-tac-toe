import { z } from "zod";

import { zUpdateNotFullyRegisteredIn } from "../../ports/repository";

import { zBasicUser, zFullyRegisteredUser, zUserAvatarAsFile } from "~/core";

const zUpdatePersonalDataIn = zUpdateNotFullyRegisteredIn.extend({
  avatar: z.union([zBasicUser.shape.avatar, zUserAvatarAsFile]).optional(),
});
type UpdatePersonalDataIn = z.infer<typeof zUpdatePersonalDataIn>;

const zUpdateCredentialsIn = zFullyRegisteredUser
  .pick({
    email: true,
    password: true,
  })
  .partial()
  .merge(
    zFullyRegisteredUser.pick({
      id: true,
    }),
  );
type UpdateCredentialsIn = z.infer<typeof zUpdateCredentialsIn>;

const zUpdateCredentialsOut = zFullyRegisteredUser.omit({
  password: true,
});
type UpdateCredentialsOut = z.infer<typeof zUpdateCredentialsOut>;

export { zUpdateCredentialsIn, zUpdateCredentialsOut, zUpdatePersonalDataIn };
export type { UpdateCredentialsIn, UpdateCredentialsOut, UpdatePersonalDataIn };
