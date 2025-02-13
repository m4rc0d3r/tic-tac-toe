import { z } from "zod";

export const zLastName = z.string().trim().max(64);
export type LastName = z.infer<typeof zLastName>;
