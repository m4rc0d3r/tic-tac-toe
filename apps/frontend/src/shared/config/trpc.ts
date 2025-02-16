import { z } from "zod";

const zTrpcConfig = z
  .object({
    VITE_TRPC_PREFIX: z.string().nonempty(),
  })
  .transform(({ VITE_TRPC_PREFIX }) => ({
    prefix: VITE_TRPC_PREFIX,
  }));
type TrpcConfig = z.infer<typeof zTrpcConfig>;

export { zTrpcConfig };
export type { TrpcConfig };
