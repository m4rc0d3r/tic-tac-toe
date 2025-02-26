import { z } from "zod";

const errorMapForForms: z.ZodErrorMap = (issue, ctx) => {
  const { code } = issue;

  if (code === z.ZodIssueCode.invalid_string) {
    const { validation } = issue;
    if (typeof validation === "string") {
      return {
        message: `Does not match ${validation} format`,
      };
    }
    if ("includes" in validation) {
      const { includes, position } = validation;
      const parts = [`Must contain "${includes}"`];
      if (typeof position === "number") {
        parts.push(`starting at position ${position}`);
      }
      return {
        message: parts.join(" "),
      };
    }
    if ("startsWith" in validation) {
      return {
        message: `Must start with "${validation.startsWith}"`,
      };
    }
    if ("endsWith" in validation) {
      return {
        message: `Must end with "${validation.endsWith}"`,
      };
    }
  }

  if (code === z.ZodIssueCode.too_small) {
    const { inclusive, minimum, type, exact } = issue;
    if (type === "string") {
      if (exact) {
        return {
          message: `Incorrect number of characters, must be exactly ${minimum}`,
        };
      }
      const exactMinimum = Number(inclusive ? minimum : Number(minimum) + 1);
      return {
        message: `Not enough characters, at least ${exactMinimum} ${exactMinimum === 1 ? "is" : "are"} required`,
      };
    }
  }

  return {
    message: ctx.defaultError,
  };
};

export { errorMapForForms };
