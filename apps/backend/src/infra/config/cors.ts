import { z } from "zod";

const zCorsConfig = z.object({
  origin: z.string().url(),
  credentials: z.boolean(),
});
type CorsConfig = z.infer<typeof zCorsConfig>;

export { zCorsConfig };
export type { CorsConfig };
