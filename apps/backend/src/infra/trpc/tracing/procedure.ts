import type {
  MaybePromise,
  ProcedureResolverOptions,
  UnsetMarker,
} from "@trpc/server/unstable-core-do-not-import";

import type { TrpcContext } from "../context";

import { withExecutionHooks } from "~/shared";

type Handler<
  TContext extends TrpcContext,
  TMeta,
  TContextOverrides,
  TInputOut,
  TOutputParserIn,
  $Output,
> = (
  opts: ProcedureResolverOptions<TContext, TMeta, TContextOverrides, TInputOut>,
) => MaybePromise<TOutputParserIn extends UnsetMarker ? $Output : TOutputParserIn>;

function procedureWithTracing<
  TContext extends TrpcContext,
  TMeta,
  TContextOverrides,
  TInputOut,
  TOutputParserIn,
  $Output,
>(handler: Handler<TContext, TMeta, TContextOverrides, TInputOut, TOutputParserIn, $Output>) {
  return withExecutionHooks(handler, {
    onStart: ({ execId, args }) => {
      const { nodeEnv, logger, type, path, input } = extract(
        args as Parameters<Handler<TContext, TMeta, TContext, TInputOut, TOutputParserIn, $Output>>,
      );

      if (nodeEnv !== "dev") {
        return;
      }

      logger.debug(
        {
          execId,
          type,
          path,
          input,
        },
        "tRPC procedure execution started",
      );
    },
    onComplete: ({ execId, args }, output, executionTime) => {
      const { nodeEnv, logger, type, path } = extract(
        args as Parameters<Handler<TContext, TMeta, TContext, TInputOut, TOutputParserIn, $Output>>,
      );

      if (nodeEnv !== "dev") {
        return;
      }

      logger.debug(
        {
          execId,
          type,
          path,
          output,
          executionTime,
        },
        "tRPC procedure execution completed",
      );
    },
    onInterrupt: ({ execId, args }, err, executionTime) => {
      const { nodeEnv, logger, type, path } = extract(
        args as Parameters<Handler<TContext, TMeta, TContext, TInputOut, TOutputParserIn, $Output>>,
      );

      if (nodeEnv !== "dev") {
        return;
      }

      logger.warn(
        {
          execId,
          type,
          path,
          err,
          executionTime,
        },
        "tRPC procedure execution interrupted",
      );
    },
  }) as typeof handler;
}

function extract<
  TContext extends TrpcContext,
  TMeta,
  TContextOverrides extends TContext,
  TInputOut,
  TOutputParserIn,
  $Output,
>(
  args: Parameters<
    Handler<TContext, TMeta, TContextOverrides, TInputOut, TOutputParserIn, $Output>
  >,
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

export { procedureWithTracing };
