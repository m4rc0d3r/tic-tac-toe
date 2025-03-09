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

const zUser = z.object({
  id: zId,
  email: zEmail,
  nickname: zUserNickname,
  firstName: zUserFirstName.default(EMPTY_STRING),
  lastName: zUserLastName.default(EMPTY_STRING),
  avatar: zUserAvatar.default(EMPTY_STRING),
  password: zUserPassword,
  passwordHash: zUserPasswordHash,
});
type User = z.infer<typeof zUser>;

export { zUser };
export type { User };
