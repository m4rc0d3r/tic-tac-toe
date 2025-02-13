import { z } from "zod";

const zCookieConfig = z
  .object({
    COOKIE_SECRET: z.string().nonempty(),
  })
  .transform(({ COOKIE_SECRET }) => ({
    secret: COOKIE_SECRET,
  }));
type CookiesConfig = z.infer<typeof zCookieConfig>;

export { zCookieConfig };
export type { CookiesConfig };
