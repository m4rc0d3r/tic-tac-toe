import { z } from "zod";

const zBcryptConfig = z
  .object({
    BCRYPT_ROUND_COUNT: z.coerce.number().positive(),
  })
  .transform(({ BCRYPT_ROUND_COUNT }) => ({
    numberOfRounds: BCRYPT_ROUND_COUNT,
  }));
type BcryptConfig = z.infer<typeof zBcryptConfig>;

export { zBcryptConfig };
export type { BcryptConfig };
