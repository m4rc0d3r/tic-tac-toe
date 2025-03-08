import type { MiddlewareFunction } from "@trpc/server/unstable-core-do-not-import";

import type { TrpcContext } from "../context";

import { withExecutionHooks } from "~/shared";

type Handler<
  TContext extends TrpcContext,
  TMeta,
  TContextOverridesIn,
  $ContextOverridesOut,
  TInputOut,
> = MiddlewareFunction<TContext, TMeta, TContextOverridesIn, $ContextOverridesOut, TInputOut>;

function middlewareWithTracing<
  TContext extends TrpcContext,
  TMeta,
  TContextOverridesIn,
  $ContextOverridesOut,
  TInputOut,
>(
  handler: Handler<TContext, TMeta, TContextOverridesIn, $ContextOverridesOut, TInputOut>,
  purpose?: string,
) {
  return withExecutionHooks(handler, {
    onStart: ({ execId, args }) => {
      const { nodeEnv, logger, type, path } = extract(
        args as Parameters<Handler<TContext, TMeta, TContext, $ContextOverridesOut, TInputOut>>,
      );

      if (nodeEnv !== "dev") {
        return;
      }

      logger.debug(
        {
          execId,
          purpose,
          type,
          path,
        },
        "tRPC middleware execution started",
      );
    },
    onComplete: ({ execId, args }, _output, executionTime) => {
      const { nodeEnv, logger, type, path } = extract(
        args as Parameters<Handler<TContext, TMeta, TContext, $ContextOverridesOut, TInputOut>>,
      );

      if (nodeEnv !== "dev") {
        return;
      }

      logger.debug(
        {
          execId,
          purpose,
          type,
          path,
          executionTime,
        },
        "tRPC middleware execution completed",
      );
    },
    onInterrupt: ({ execId, args }, err, executionTime) => {
      const { nodeEnv, logger, type, path } = extract(
        args as Parameters<Handler<TContext, TMeta, TContext, $ContextOverridesOut, TInputOut>>,
      );

      if (nodeEnv !== "dev") {
        return;
      }

      logger.warn(
        {
          execId,
          purpose,
          type,
          path,
          err,
          executionTime,
        },
        "tRPC middleware execution interrupted",
      );
    },
  }) as typeof handler;
}

function extract<
  TContext extends TrpcContext,
  TMeta,
  TContextOverridesIn extends TContext,
  $ContextOverridesOut,
  TInputOut,
>(
  args: Parameters<Handler<TContext, TMeta, TContextOverridesIn, $ContextOverridesOut, TInputOut>>,
) {
  const [opts] = args;
  const {
    ctx: {
      req: { log: logger },
      config: {
        app: { nodeEnv },
      },
    },
    input,
  } = opts;

  const TYPE = "type";
  const PATH = "path";
  const type = TYPE in opts ? opts[TYPE] : undefined;
  const path = PATH in opts ? opts[PATH] : undefined;

  return {
    logger,
    nodeEnv,
    input,
    type,
    path,
  };
}

export { middlewareWithTracing };
