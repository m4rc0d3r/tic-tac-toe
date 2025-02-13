import { z } from "zod";

const zTrpcConfig = z
  .object({
    TRPC_PREFIX: z.string().nonempty(),
  })
  .transform(({ TRPC_PREFIX }) => ({
    prefix: TRPC_PREFIX,
  }));
type TrpcConfig = z.infer<typeof zTrpcConfig>;

export { zTrpcConfig };
export type { TrpcConfig };
