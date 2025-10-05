import { z } from "zod";
import { zfd } from "zod-form-data";

import { zBasicUser, zUserAvatarAsFile } from "~/core";

const zUpdatePersonalDataIn = zfd.formData(
  zBasicUser
    .pick({
      nickname: true,
      firstName: true,
      lastName: true,
    })
    .extend({
      avatar: z.union([zBasicUser.shape.avatar, zfd.file(zUserAvatarAsFile)]),
    })
    .partial(),
);
type UpdatePersonalDataIn = z.infer<typeof zUpdatePersonalDataIn>;

const zUpdatePersonalDataOut = zBasicUser;
type UpdatePersonalDataOut = z.infer<typeof zUpdatePersonalDataOut>;

export { zUpdatePersonalDataIn, zUpdatePersonalDataOut };
export type { UpdatePersonalDataIn, UpdatePersonalDataOut };
