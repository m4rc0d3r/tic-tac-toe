import { z } from "zod";

const zId = z.number();
type Id = z.infer<typeof zId>;

export { zId };
export type { Id };
