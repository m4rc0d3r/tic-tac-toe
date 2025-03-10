import { z } from "zod";

import { zUpdateIn as zBaseUpdateIn } from "../../ports/repository";

import { zUser, zUserAvatarAsFile } from "~/core";

const zUpdateIn = zBaseUpdateIn
  .omit({
    passwordHash: true,
  })
  .merge(
    zUser
      .pick({
        password: true,
      })
      .extend({
        avatar: z.union([zUser.shape.avatar, zUserAvatarAsFile]),
      })
      .partial(),
  );
type UpdateIn = z.infer<typeof zUpdateIn>;

export { zUpdateIn };
export type { UpdateIn };
