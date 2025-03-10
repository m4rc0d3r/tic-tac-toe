import { z } from "zod";
import { zfd } from "zod-form-data";

import { zUser, zUserAvatarAsFile } from "~/core";
import { zUpdateOut } from "~/features/users/app/ports/repository";

const zUpdatePersonalDataIn = zfd.formData(
  zUser
    .pick({
      nickname: true,
      firstName: true,
      lastName: true,
    })
    .extend({
      avatar: z.union([zUser.shape.avatar, zfd.file(zUserAvatarAsFile)]),
    })
    .partial(),
);
type UpdatePersonalDataIn = z.infer<typeof zUpdatePersonalDataIn>;

const zUpdatePersonalDataOut = zUpdateOut.omit({
  passwordHash: true,
});
type UpdatePersonalDataOut = z.infer<typeof zUpdatePersonalDataOut>;

export { zUpdatePersonalDataIn, zUpdatePersonalDataOut };
export type { UpdatePersonalDataIn, UpdatePersonalDataOut };
