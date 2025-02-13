import { z } from "zod";

export const zNickname = z.string().trim().min(4).max(32);
export type Nickname = z.infer<typeof zNickname>;
