import { z } from "zod";

export const zPassword = z.string().trim().min(6).max(32);
export type Password = z.infer<typeof zPassword>;
