import { z } from "zod";

export const zAvatar = z.union([z.string().trim().length(0), z.string().url()]);
export type Avatar = z.infer<typeof zAvatar>;
