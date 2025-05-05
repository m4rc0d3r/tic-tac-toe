import { EMPTY_STRING } from "@tic-tac-toe/core";
import { z } from "zod";

import {
  zEmail,
  zId,
  zUserAvatar,
  zUserFirstName,
  zUserLastName,
  zUserNickname,
  zUserPassword,
  zUserPasswordHash,
} from "../value-objects";

const USER_DISCRIMINATOR_KEY = "registrationStatus";

const zBasicUser = z.object({
  id: zId,
  nickname: zUserNickname,
  firstName: zUserFirstName.default(EMPTY_STRING),
  lastName: zUserLastName.default(EMPTY_STRING),
  avatar: zUserAvatar.default(EMPTY_STRING),
});
type BasicUser = z.infer<typeof zBasicUser>;

const zNotFullyRegisteredUser = zBasicUser.extend({
  [USER_DISCRIMINATOR_KEY]: z.literal("PARTIAL"),
});
type NotFullyRegisteredUser = z.infer<typeof zNotFullyRegisteredUser>;

const zFullyRegisteredUser = zBasicUser.extend({
  [USER_DISCRIMINATOR_KEY]: z.literal("FULL"),
  email: zEmail,
  password: zUserPassword,
  passwordHash: zUserPasswordHash,
});
type FullyRegisteredUser = z.infer<typeof zFullyRegisteredUser>;

const zUser = z.discriminatedUnion(USER_DISCRIMINATOR_KEY, [
  zNotFullyRegisteredUser,
  zFullyRegisteredUser,
]);
type User = z.infer<typeof zUser>;

export { USER_DISCRIMINATOR_KEY, zBasicUser, zFullyRegisteredUser, zNotFullyRegisteredUser, zUser };
export type { BasicUser, FullyRegisteredUser, NotFullyRegisteredUser, User };
