import { z } from "zod";

import {
  zEmail,
  zId,
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
  firstName: zUserFirstName.default(""),
  lastName: zUserLastName.default(""),
  password: zUserPassword,
  passwordHash: zUserPasswordHash,
});
type User = z.infer<typeof zUser>;

export { zUser };
export type { User };
