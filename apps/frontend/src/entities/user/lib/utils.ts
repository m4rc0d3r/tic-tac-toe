import { EMPTY, SPACE } from "@tic-tac-toe/core";

import type { User } from "../model";

type UserNames = Pick<User, "firstName" | "lastName">;

function getFullName({ firstName, lastName }: UserNames) {
  return [firstName, lastName].join(SPACE);
}

function splitFullName(fullName: string): UserNames {
  const [firstName = EMPTY, lastName = EMPTY] = fullName.split(SPACE);

  return { firstName, lastName };
}

function getInitials({ firstName, lastName }: UserNames) {
  return [firstName, lastName].map((value) => value.at(0)?.toLocaleUpperCase()).join(EMPTY);
}

export { getFullName, getInitials, splitFullName };
