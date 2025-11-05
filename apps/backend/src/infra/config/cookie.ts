import { zBooleanishString } from "@tic-tac-toe/core";
import { z } from "zod";

const zCookieConfig = z
  .object({
    COOKIE_SECRET: z.string().nonempty(),
    COOKIE_DOMAIN: z.string().nonempty(),
    COOKIE_SAME_SITE: z.union([zBooleanishString, z.enum(["strict", "lax", "none"])]),
    COOKIE_SECURE: z.union([zBooleanishString, z.literal("auto")]),
  })
  .transform(({ COOKIE_SECRET, COOKIE_DOMAIN, COOKIE_SAME_SITE, COOKIE_SECURE }) => {
    const sameSite = COOKIE_SAME_SITE;
    const secure = COOKIE_SECURE;
    return {
      secret: COOKIE_SECRET,
      domain: COOKIE_DOMAIN,
      sameSite,
      secure: sameSite === "none" || secure,
      raw: () => ({
        sameSite,
        secure,
      }),
    };
  });
type CookiesConfig = z.infer<typeof zCookieConfig>;

export { zCookieConfig };
export type { CookiesConfig };
