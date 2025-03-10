import type { z } from "zod";

import { zUser } from "~/core";

const zUpdateIn = zUser
  .omit({
    password: true,
  })
  .partial()
  .merge(
    zUser.pick({
      id: true,
    }),
  );
type UpdateIn = z.infer<typeof zUpdateIn>;

const zUpdateOut = zUser.omit({
  password: true,
});
type UpdateOut = z.infer<typeof zUpdateOut>;

export { zUpdateIn, zUpdateOut };
export type { UpdateIn, UpdateOut };
