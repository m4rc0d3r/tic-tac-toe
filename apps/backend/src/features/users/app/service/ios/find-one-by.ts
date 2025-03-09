import { z } from "zod";

import { zUser } from "~/core";

const zFindOneByIn = z.union([
  zUser
    .pick({
      id: true,
    })
    .merge(
      zUser
        .pick({
          password: true,
        })
        .partial(),
    ),
  zUser
    .pick({
      email: true,
    })
    .merge(
      zUser
        .pick({
          password: true,
        })
        .partial(),
    ),
]);
type FindOneByIn = z.infer<typeof zFindOneByIn>;

export { zFindOneByIn };
export type { FindOneByIn };
