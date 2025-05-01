import { z } from "zod";

const zCookieConfig = z
  .object({
    COOKIE_SECRET: z.string().nonempty(),
    COOKIE_DOMAIN: z.string().nonempty(),
  })
  .transform(({ COOKIE_SECRET, COOKIE_DOMAIN }) => ({
    secret: COOKIE_SECRET,
    domain: COOKIE_DOMAIN,
  }));
type CookiesConfig = z.infer<typeof zCookieConfig>;

export { zCookieConfig };
export type { CookiesConfig };
