import type { UnionToTuple } from "type-fest";

import type { Session } from "../entities";

import type { ConstraintsMap } from "./constraints";

const sessionUniqueConstraintsMap = {
  id: ["id"],
} as const satisfies ConstraintsMap<Session>;
type SessionUniqueConstraintsMap = typeof sessionUniqueConstraintsMap;

type SessionFieldsInUniqueConstraints =
  SessionUniqueConstraintsMap[keyof SessionUniqueConstraintsMap];
const sessionFieldsInUniqueConstraints = Object.values(
  sessionUniqueConstraintsMap,
) as UnionToTuple<SessionFieldsInUniqueConstraints>;

export { sessionFieldsInUniqueConstraints, sessionUniqueConstraintsMap };
export type { SessionFieldsInUniqueConstraints, SessionUniqueConstraintsMap };
