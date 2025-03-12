import type { z } from "zod";

import type { NonOperationalErrorOptions } from "./non-operational.error";
import { NonOperationalError } from "./non-operational.error";

import { stringify2 } from "~/json";

type ConfigVarProblem = {
  name: string;
  message: string;
  code: string;
};

class ConfigVarsError extends NonOperationalError {
  constructor(
    readonly problems: ConfigVarProblem[],
    options?: NonOperationalErrorOptions,
  ) {
    super(options);
    this.message = `Problems with environment variables (missing, wrong data type, etc.): ${stringify2(this.problems)}`;
  }

  static fromZodError(error: z.ZodError) {
    return new ConfigVarsError(
      error.issues.map((issue) => ({
        name: issue.path.join("."),
        message: issue.message,
        code: issue.code,
      })),
      { cause: error },
    );
  }
}

export { ConfigVarsError };
export type { ConfigVarProblem };
