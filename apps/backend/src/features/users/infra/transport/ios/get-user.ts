import { z } from "zod";

import { zBasicUser } from "~/core";

const zGetUserIn = zBasicUser.pick({
  id: true,
});
type GetUserIn = z.infer<typeof zGetUserIn>;

const zGetUserOut = zBasicUser.extend({
  lastOnlineAt: z.date(),
});
type GetUserOut = z.infer<typeof zGetUserOut>;

export { zGetUserIn, zGetUserOut };
export type { GetUserIn, GetUserOut };
