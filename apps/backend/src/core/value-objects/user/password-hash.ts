import { z } from "zod";

export const zPasswordHash = z.string().nonempty();
export type PasswordHash = z.infer<typeof zPasswordHash>;
