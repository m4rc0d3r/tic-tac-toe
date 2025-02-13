import type { UnionToTuple } from "type-fest";

import type { User } from "../entities";

import type { ConstraintsMap } from "./constraints";

const userUniqueConstraintsMap = {
  email: ["email"],
  nickname: ["nickname"],
} as const satisfies ConstraintsMap<User>;
type UserUniqueConstraintsMap = typeof userUniqueConstraintsMap;

type UserFieldsInUniqueConstraints = UserUniqueConstraintsMap[keyof UserUniqueConstraintsMap];
const userFieldsInUniqueConstraints = Object.values(
  userUniqueConstraintsMap,
) as UnionToTuple<UserFieldsInUniqueConstraints>;

export { userFieldsInUniqueConstraints, userUniqueConstraintsMap };
export type { UserFieldsInUniqueConstraints, UserUniqueConstraintsMap };
