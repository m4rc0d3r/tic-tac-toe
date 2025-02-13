import { z } from "zod";

import { zFindOneByOut } from "./find-one-by";

const zListOut = z.array(zFindOneByOut);
type ListOut = z.infer<typeof zListOut>;

export { zListOut };
export type { ListOut };
