import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

const UNIQUE_CONSTRAINT_CODE = "P2002";

function isUniqueKeyViolation(error: unknown): error is PrismaClientKnownRequestError & {
  code: typeof UNIQUE_CONSTRAINT_CODE;
  meta: {
    target: string[];
  };
} {
  return error instanceof PrismaClientKnownRequestError && error.code === UNIQUE_CONSTRAINT_CODE;
}

export { isUniqueKeyViolation };
