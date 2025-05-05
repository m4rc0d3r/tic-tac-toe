import { z } from "zod";

import { zBasicUser, zFullyRegisteredUser } from "~/core";

const zFindOneByIn = z.union([
  zBasicUser.pick({
    id: true,
  }),
  zFullyRegisteredUser
    .pick({
      email: true,
    })
    .merge(
      zFullyRegisteredUser
        .pick({
          password: true,
        })
        .partial(),
    ),
]);
type FindOneByIn = z.infer<typeof zFindOneByIn>;

export { zFindOneByIn };
export type { FindOneByIn };
