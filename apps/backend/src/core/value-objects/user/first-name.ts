import { z } from "zod";

export const zFirstName = z.string().trim().max(64);
export type FirstName = z.infer<typeof zFirstName>;
