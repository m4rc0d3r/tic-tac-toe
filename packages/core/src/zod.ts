import { z } from "zod";

const TRUE = "true";

const zBooleanishString = z.enum([TRUE, "false"]).transform((value) => value === TRUE);

export { zBooleanishString };
