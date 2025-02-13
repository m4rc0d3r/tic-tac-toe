import { z } from "zod";

import { zRegisterOut } from "./register";

const zRefreshIn = z.object({
  extendSession: z.boolean().default(false),
});
type RefreshIn = z.infer<typeof zRefreshIn>;

const zRefreshOut = zRegisterOut.pick({ accessToken: true });
type RefreshOut = z.infer<typeof zRefreshOut>;

export { zRefreshIn, zRefreshOut };
export type { RefreshIn, RefreshOut };
