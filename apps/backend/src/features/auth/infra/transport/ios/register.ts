import { z } from "zod";

import { zCreateIn, zCreateOut } from "~/features/users/app";

const zRegisterIn = zCreateIn;
type RegisterIn = z.infer<typeof zRegisterIn>;

const zRegisterOut = z.object({
  accessToken: z.string().jwt(),
  me: zCreateOut.omit({
    passwordHash: true,
  }),
});
type RegisterOut = z.infer<typeof zRegisterOut>;

export { zRegisterIn, zRegisterOut };
export type { RegisterIn, RegisterOut };
