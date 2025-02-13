import type { Paths } from "type-fest";

type Constraint<Value> = Paths<Value>[];
type ConstraintsMap<Value> = Record<string, Constraint<Value>>;

export type { Constraint, ConstraintsMap };
