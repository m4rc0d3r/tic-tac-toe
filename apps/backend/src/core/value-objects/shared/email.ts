import { z } from "zod";

export const zEmail = z.string().trim().email();
export type Email = z.infer<typeof zEmail>;
