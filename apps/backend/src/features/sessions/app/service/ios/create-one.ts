import type { z } from "zod";

import { zCreateOneIn as zBaseCreateOneIn } from "../../ports/repository";

const zCreateOneIn = zBaseCreateOneIn.omit({
  id: true,
  maximumAge: true,
});
type CreateOneIn = z.infer<typeof zCreateOneIn>;

export { zCreateOneIn };
export type { CreateOneIn };
