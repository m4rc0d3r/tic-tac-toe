import type { TypeInfo } from "@tic-tac-toe/core";
import { getTypeInfo, isNullish, isObject } from "@tic-tac-toe/core";
import type { FastifyBaseLogger } from "fastify";

import { withExecutionHooks } from "./helpers";

/**
 * This function returns the same object that was passed to it, meaning it modifies it in place
 * rather than creating a new one.
 */
function withMethodTracing<T>(value: T, logger: FastifyBaseLogger) {
  const methodDescriptors = Object.fromEntries(
    Object.entries(getDescriptors(value)).map(([key, descriptor]) => {
      const original = descriptor.value;
      const functionName = original.name;
      const wrapper = withExecutionHooks(original, {
        onStart: ({ execId, thisArg, args }) => {
          const thisTypeInfo = getTypeInfo(thisArg);
          logOfExecutionStart(
            logger,
            execId,
            functionName,
            thisTypeInfo.prototype ? thisTypeInfo : thisTypeInfo.type,
            args,
          );
        },
        onComplete: ({ execId }, result, executionTime) =>
          logCompletedExecution(logger, execId, functionName, result, executionTime),
        onInterrupt: ({ execId }, error, executionTime) =>
          logInterruptedExecution(logger, execId, functionName, error, executionTime),
      });

      return [
        key,
        {
          ...descriptor,
          value: wrapper,
        },
      ];
    }),
  );

  Object.defineProperties(value, methodDescriptors);

  return value;
}

type MethodDescriptorMap = Record<
  string,
  Omit<PropertyDescriptor, "value"> & {
    value: (...args: unknown[]) => unknown;
  }
>;

function getDescriptors(value: unknown): MethodDescriptorMap {
  if (isNullish(value) || (isObject(value) && value.constructor === Object)) {
    return {};
  }

  return {
    ...getDescriptors(Object.getPrototypeOf(value)),
    ...(Object.fromEntries(
      Object.entries(Object.getOwnPropertyDescriptors(value)).filter(
        (entry) => typeof entry[1].value === "function" && entry[0] !== "constructor",
      ),
    ) as MethodDescriptorMap),
  };
}

function logOfExecutionStart(
  logger: FastifyBaseLogger,
  execId: number,
  func: string,
  thisArg: TypeInfo | TypeInfo["type"],
  args: unknown[],
) {
  logger.debug(
    {
      execId,
      func,
      thisArg,
      args: args.entries().reduce(
        (acc, [pos, arg]) => {
          acc[pos + 1] = arg;
          return acc;
        },
        Object.create(null) as Record<string, unknown>,
      ),
    },
    "execution started",
  );
}

function logCompletedExecution(
  logger: FastifyBaseLogger,
  execId: number,
  func: string,
  result: unknown,
  executionTime: number,
) {
  logger.debug(
    {
      execId,
      func,
      result,
      executionTime,
    },
    "execution completed",
  );
}

function logInterruptedExecution(
  logger: FastifyBaseLogger,
  execId: number,
  func: string,
  err: unknown,
  executionTime: number,
) {
  logger.warn(
    {
      execId,
      func,
      err,
      executionTime,
    },
    "execution interrupted",
  );
}

export { withMethodTracing };
