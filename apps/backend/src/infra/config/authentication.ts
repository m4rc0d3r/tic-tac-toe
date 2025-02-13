import type { StringValue } from "ms";
import ms from "ms";
import { z } from "zod";

const zAuthenticationConfig = z
  .object({
    ACCESS_TOKEN_SECRET: z.string().nonempty(),
    ACCESS_TOKEN_LIFETIME: z.union([z.string().nonempty(), z.coerce.number().int()]),
    REFRESH_TOKEN_SECRET: z.string().nonempty(),
    REFRESH_TOKEN_LIFETIME: z.union([z.string().nonempty(), z.coerce.number().int()]),
    REFRESH_TOKEN_COOKIE_NAME: z.string().nonempty(),
  })
  .superRefine((value, ctx) => {
    const { ACCESS_TOKEN_LIFETIME, REFRESH_TOKEN_LIFETIME } = value;
    refine({ ACCESS_TOKEN_LIFETIME }, ctx);
    refine({ REFRESH_TOKEN_LIFETIME }, ctx);
  })
  .transform(
    ({
      ACCESS_TOKEN_SECRET,
      ACCESS_TOKEN_LIFETIME,
      REFRESH_TOKEN_SECRET,
      REFRESH_TOKEN_LIFETIME,
      REFRESH_TOKEN_COOKIE_NAME,
    }) => ({
      jwt: {
        access: {
          secret: ACCESS_TOKEN_SECRET,
          lifetime: ACCESS_TOKEN_LIFETIME as
            | Exclude<typeof ACCESS_TOKEN_LIFETIME, string>
            | StringValue,
        },
        refresh: {
          secret: REFRESH_TOKEN_SECRET,
          lifetime: REFRESH_TOKEN_LIFETIME as
            | Exclude<typeof REFRESH_TOKEN_LIFETIME, string>
            | StringValue,
        },
      },
      refreshTokenCookieName: REFRESH_TOKEN_COOKIE_NAME,
    }),
  );
type AuthenticationConfig = z.infer<typeof zAuthenticationConfig>;

function refine(
  obj:
    | Record<"ACCESS_TOKEN_LIFETIME", string | number>
    | Record<"REFRESH_TOKEN_LIFETIME", string | number>,
  ctx: z.RefinementCtx,
) {
  const [key, value] = Object.entries(obj).at(0)!;

  const code = z.ZodIssueCode.custom;
  const path = [key];
  if (typeof value === "string") {
    try {
      const valueAsMs = ms(value as StringValue);
      if (isNaN(valueAsMs)) {
        ctx.addIssue({
          code,
          message: "The value does not match the format",
          path,
        });
      }
    } catch (error) {
      if (error instanceof Error) {
        ctx.addIssue({
          code,
          message:
            error.message ===
            "Value provided to ms.parse() must be a string with length between 1 and 99."
              ? "The value length must be between 1 and 99."
              : error.message,
          path,
        });
      }
    }
  }
}

export { zAuthenticationConfig };
export type { AuthenticationConfig };
