import { z } from "zod";

import { zUser } from "~/core";

const zFindOneByIn = z.union([
  zUser.pick({
    id: true,
  }),
  zUser.pick({
    email: true,
  }),
]);
type FindOneByIn = z.infer<typeof zFindOneByIn>;

const zFindOneByOut = zUser.omit({
  password: true,
});
type FindOneByOut = z.infer<typeof zFindOneByOut>;

export { zFindOneByIn, zFindOneByOut };
export type { FindOneByIn, FindOneByOut };
