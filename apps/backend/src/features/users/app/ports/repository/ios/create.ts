import type { z } from "zod";

import { zUser } from "~/core";

const zCreateIn = zUser.omit({
  id: true,
  password: true,
});
type CreateIn = z.infer<typeof zCreateIn>;

const zCreateOut = zUser.omit({
  password: true,
});
type CreateOut = z.infer<typeof zCreateOut>;

export { zCreateIn, zCreateOut };
export type { CreateIn, CreateOut };
