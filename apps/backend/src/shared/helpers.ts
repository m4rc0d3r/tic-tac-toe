/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-this-alias */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { isAsyncFunction } from "util/types";

let currentExecId = 0;

type SharedHookParams<Args, This> = {
  execId: number;
  thisArg: This;
  args: Args;
};

type ExecutionHooks<Args, Result, This> = Partial<{
  onStart: (params: SharedHookParams<Args, This>) => void;
  onComplete: (params: SharedHookParams<Args, This>, result: Result, executionTime: number) => void;
  onInterrupt: (
    params: SharedHookParams<Args, This>,
    error: unknown,
    executionTime: number,
  ) => void;
}>;

function withExecutionHooks<
  Func extends (...args: any[]) => any,
  Args extends Parameters<Func>,
  Result extends ReturnType<Func>,
  This extends ThisParameterType<Func>,
>(func: Func, hooks: ExecutionHooks<Args, Result, This>) {
  const wrapper = isAsyncFunction(func)
    ? async function (this: This, ...args: Args) {
        const { onStart, onComplete, onInterrupt } = hooks;
        const thisArg = this;
        const params = {
          execId: currentExecId++,
          thisArg,
          args,
        };
        onStart?.(params);
        const startTime = performance.now();
        try {
          const result = await func.apply(this, args);
          onComplete?.(params, result, performance.now() - startTime);
          return result;
        } catch (error) {
          onInterrupt?.(params, error, performance.now() - startTime);
          throw error;
        }
      }
    : function (this: This, ...args: Args) {
        const { onStart, onComplete, onInterrupt } = hooks;
        const thisArg = this;
        const params = {
          execId: currentExecId++,
          thisArg,
          args,
        };
        onStart?.(params);
        const startTime = performance.now();
        try {
          const result = func.apply(this, args);
          onComplete?.(params, result, performance.now() - startTime);
          return result;
        } catch (error) {
          onInterrupt?.(params, error, performance.now() - startTime);
          throw error;
        }
      };

  const NAME = "name";
  const name = Object.getOwnPropertyDescriptor(func, NAME);
  if (name) {
    Object.defineProperty(wrapper, NAME, {
      ...name,
    });
  }

  return wrapper;
}

export { withExecutionHooks };
export type { ExecutionHooks };
