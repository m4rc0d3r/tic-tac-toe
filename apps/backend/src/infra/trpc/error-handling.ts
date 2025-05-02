import { EMPTY_STRING } from "@tic-tac-toe/core";
import { TRPCError } from "@trpc/server";
import type { DefaultErrorShape } from "@trpc/server/unstable-core-do-not-import";
import { TRPC_ERROR_CODES_BY_KEY } from "@trpc/server/unstable-core-do-not-import";
import { z } from "zod";

import { NotFoundError, UniqueKeyViolationError } from "~/app";
import { AuthenticationError } from "~/features/auth/infra/transport/errors";
import { UserUpdateError } from "~/features/users/infra/transport/errors";

const HTTP_STATUS_PHRASES_BY_ERROR_AREA = {
  BAD_REQUEST: "BAD_REQUEST",
  AUTHENTICATION: "UNAUTHORIZED",
  NOT_FOUND: "NOT_FOUND",
  UNIQUE_KEY_VIOLATION: "CONFLICT",
  VALIDATION: "UNPROCESSABLE_CONTENT",
  UNKNOWN: "INTERNAL_SERVER_ERROR",
} as const satisfies Record<string, HttpStatusPhrase>;
type ErrorArea = keyof typeof HTTP_STATUS_PHRASES_BY_ERROR_AREA;

const HTTP_STATUSES = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_SUPPORTED: 405,
  TIMEOUT: 408,
  CONFLICT: 409,
  PRECONDITION_FAILED: 412,
  PAYLOAD_TOO_LARGE: 413,
  UNSUPPORTED_MEDIA_TYPE: 415,
  UNPROCESSABLE_CONTENT: 422,
  TOO_MANY_REQUESTS: 429,
  CLIENT_CLOSED_REQUEST: 499,
  INTERNAL_SERVER_ERROR: 500,
  NOT_IMPLEMENTED: 501,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
} as const;
type HttpStatuses = typeof HTTP_STATUSES;
type HttpStatusPhrase = keyof HttpStatuses;

function formatTrpcError(error: TRPCError, path?: string, stack?: string) {
  const cause = convertErrorCause(error.cause ?? new Error());
  const code = HTTP_STATUS_PHRASES_BY_ERROR_AREA[cause.area];

  const defaultShape = {
    message: EMPTY_STRING,
    code: TRPC_ERROR_CODES_BY_KEY[code],
    data: {
      code,
      httpStatus: HTTP_STATUSES[code],
      ...(path && { path }),
      ...(stack && { stack }),
    } as const,
  } as const satisfies DefaultErrorShape;

  return {
    ...defaultShape,
    cause,
  } as const;
}

function convertErrorCause(cause: Error) {
  if (cause instanceof z.ZodError) {
    const { issues } = cause;
    return {
      area: "VALIDATION" satisfies ErrorArea,
      issues,
    } as const;
  } else if (cause instanceof AuthenticationError) {
    return {
      area: "AUTHENTICATION" satisfies ErrorArea,
      reason: cause.reason,
    } as const;
  } else if (cause instanceof NotFoundError) {
    return {
      area: "NOT_FOUND" satisfies ErrorArea,
    } as const;
  } else if (cause instanceof UniqueKeyViolationError) {
    return {
      area: "UNIQUE_KEY_VIOLATION" satisfies ErrorArea,
      paths: cause.paths as UniqueKeyViolationError["paths"],
    } as const;
  } else if (cause instanceof UserUpdateError) {
    const { reason } = cause;
    return {
      area: "BAD_REQUEST" satisfies ErrorArea,
      reason,
    } as const;
  }

  return {
    area: "UNKNOWN" satisfies ErrorArea,
  } as const;
}

function toTrpcError(error: unknown) {
  return new TRPCError({
    code: "INTERNAL_SERVER_ERROR",
    cause: error,
  });
}

export { convertErrorCause, formatTrpcError, toTrpcError };
