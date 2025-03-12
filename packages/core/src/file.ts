import type { File } from "@web-std/file";
import { z } from "zod";

import { isObject } from "~/type-guards";

const Z_INVALID_MIME_TYPE = "invalid_mime_type";
const CUSTOM_CODE = "customCode";

type ZMimeTypeIssue = Omit<z.ZodCustomIssue, "params"> & {
  params: {
    [CUSTOM_CODE]: typeof Z_INVALID_MIME_TYPE;
    cause: z.ZodIssue;
  };
};

function isZMimeTypeIssue(value: z.ZodIssueOptionalMessage): value is ZMimeTypeIssue {
  return (
    value.code === z.ZodIssueCode.custom &&
    isObject(value.params) &&
    value.params[CUSTOM_CODE] === Z_INVALID_MIME_TYPE
  );
}

const zMimeTypeRefinement = <T extends z.ZodSchema>(schema: T) => {
  return (({ type }, ctx) => {
    const { success, error } = schema.safeParse(type);

    if (success) {
      return;
    }

    const [cause] = error.issues;

    if (!cause) {
      return;
    }

    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      params: {
        customCode: Z_INVALID_MIME_TYPE,
        cause,
      } satisfies ZMimeTypeIssue["params"],
    });
  }) as Parameters<ReturnType<typeof z.instanceof<typeof File>>["superRefine"]>[0];
};

const MIME_TYPES = {
  gif: "image/gif",
  jpeg: "image/jpeg",
  png: "image/png",
  svg: "image/svg+xml",
} as const;
type MimeType = (typeof MIME_TYPES)[keyof typeof MIME_TYPES];

const EXTENSIONS_BY_MIME_TYPE = {
  [MIME_TYPES.gif]: ".gif",
  [MIME_TYPES.jpeg]: ".jpeg",
  [MIME_TYPES.png]: ".png",
  [MIME_TYPES.svg]: ".svg",
} as const;

export {
  EXTENSIONS_BY_MIME_TYPE,
  isZMimeTypeIssue,
  MIME_TYPES,
  Z_INVALID_MIME_TYPE,
  zMimeTypeRefinement,
};
export type { MimeType, ZMimeTypeIssue };
