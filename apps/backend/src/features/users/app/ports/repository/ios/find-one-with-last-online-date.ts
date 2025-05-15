import { z } from "zod";

import {
  USER_DISCRIMINATOR_KEY,
  zBasicUser,
  zFullyRegisteredUser,
  zNotFullyRegisteredUser,
} from "~/core";

const zFindOneWithLastOnlineDateIn = zBasicUser.pick({
  id: true,
});
type FindOneWithLastOnlineDateIn = z.infer<typeof zFindOneWithLastOnlineDateIn>;

const EXTENSION_SHAPE = {
  lastOnlineAt: z.date(),
};

const zFindOneWithLastOnlineDateOut = z.discriminatedUnion(USER_DISCRIMINATOR_KEY, [
  zNotFullyRegisteredUser.extend(EXTENSION_SHAPE),
  zFullyRegisteredUser
    .omit({
      password: true,
    })
    .extend(EXTENSION_SHAPE),
]);
type FindOneWithLastOnlineDateOut = z.infer<typeof zFindOneWithLastOnlineDateOut>;

export { zFindOneWithLastOnlineDateIn, zFindOneWithLastOnlineDateOut };
export type { FindOneWithLastOnlineDateIn, FindOneWithLastOnlineDateOut };
