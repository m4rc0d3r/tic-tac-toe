import { z } from "zod";

const TRUE = "true";

const zBooleanishString = z.enum([TRUE, "false"]).transform((value) => value === TRUE);

function isTruthy(value: unknown) {
  return !!value;
}

function isFalsy(value: unknown) {
  return !value;
}

export { isFalsy, isTruthy, zBooleanishString };
