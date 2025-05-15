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

const NOT_FOUND_CODE = "P2025";

function isNotFoundError(error: unknown): error is PrismaClientKnownRequestError & {
  code: typeof NOT_FOUND_CODE;
  meta: {
    modelName: string;
    cause: string;
  };
} {
  return error instanceof PrismaClientKnownRequestError && error.code === NOT_FOUND_CODE;
}

const SYMBOLS = ["%", "_"];

function escapeLikeArgument(value: string) {
  let escapedValue = value;
  for (const symbol of SYMBOLS) {
    escapedValue = escapedValue.replaceAll(symbol, `\\${symbol}`);
  }
  return escapedValue;
}

export { escapeLikeArgument, isNotFoundError, isUniqueKeyViolation };
