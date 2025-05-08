import { zBooleanishString } from "@tic-tac-toe/core";
import { z } from "zod";

const zCookieConfig = z
  .object({
    COOKIE_SECRET: z.string().nonempty(),
    COOKIE_DOMAIN: z.string().nonempty(),
    COOKIE_SECURE: z.union([zBooleanishString, z.literal("auto")]),
  })
  .transform(({ COOKIE_SECRET, COOKIE_DOMAIN, COOKIE_SECURE }) => ({
    secret: COOKIE_SECRET,
    domain: COOKIE_DOMAIN,
    secure: COOKIE_SECURE,
  }));
type CookiesConfig = z.infer<typeof zCookieConfig>;

export { zCookieConfig };
export type { CookiesConfig };
