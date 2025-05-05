import { z } from "zod";

import { zCreateOut } from "./create";

import { zBasicUser, zFullyRegisteredUser } from "~/core";

const zFindOneByIn = z.union([
  zBasicUser.pick({
    id: true,
  }),
  zFullyRegisteredUser.pick({
    email: true,
  }),
]);
type FindOneByIn = z.infer<typeof zFindOneByIn>;

const zFindOneByOut = zCreateOut;
type FindOneByOut = z.infer<typeof zFindOneByOut>;

export { zFindOneByIn, zFindOneByOut };
export type { FindOneByIn, FindOneByOut };
