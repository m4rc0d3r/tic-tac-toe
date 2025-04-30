import type { StringValue } from "ms";
import ms from "ms";
import { z } from "zod";

const VERCEL_TIME_FORMAT_MINIMUM_LENGTH = 1;
const VERCEL_TIME_FORMAT_MAXIMUM_LENGTH = 100;

const zBaseSchema = z
  .string()
  .min(VERCEL_TIME_FORMAT_MINIMUM_LENGTH)
  .max(VERCEL_TIME_FORMAT_MAXIMUM_LENGTH);

const zVercelTimeFormat = zBaseSchema.transform(transform("StringValue"));
type VercelTimeFormat = z.infer<typeof zVercelTimeFormat>;

const zFromVercelTimeFormatToMilliseconds = zBaseSchema.transform(transform("number"));
type FromVercelTimeFormatToMilliseconds = z.infer<typeof zFromVercelTimeFormatToMilliseconds>;

type TransformationFunction<T extends StringValue | number> = (
  value: string,
  ctx: z.RefinementCtx,
) => T;

function transform(to: "StringValue"): TransformationFunction<StringValue>;
function transform(to: "number"): TransformationFunction<number>;
function transform(to: "StringValue" | "number"): TransformationFunction<StringValue | number> {
  return (value, ctx) => {
    const code = z.ZodIssueCode.custom;
    try {
      const valueAsMs = ms(value as StringValue);
      if (isNaN(valueAsMs)) {
        ctx.addIssue({
          code,
          message: "The value does not match the format",
        });
      }
      return to === "StringValue" ? (value as StringValue) : valueAsMs;
    } catch (error) {
      if (error instanceof Error) {
        ctx.addIssue({
          code,
          message: error.message,
        });
      }
    }
    return to === "StringValue" ? (value as StringValue) : NaN;
  };
}

export {
  VERCEL_TIME_FORMAT_MAXIMUM_LENGTH,
  VERCEL_TIME_FORMAT_MINIMUM_LENGTH,
  zFromVercelTimeFormatToMilliseconds,
  zVercelTimeFormat,
};
export type { FromVercelTimeFormatToMilliseconds, VercelTimeFormat };
