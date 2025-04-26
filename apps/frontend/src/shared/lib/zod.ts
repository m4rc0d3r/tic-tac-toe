import { EMPTY_STRING } from "@tic-tac-toe/core";
import type { Namespace, TFunction } from "i18next";
import { z } from "zod";

import { CASES, createTc, TRANSLATION_KEYS } from "../i18n";

import { listWithConjunction, putInQuotes } from "./text";

function errorMapForForms<Ns extends Namespace, KPrefix>(t: TFunction<Ns, KPrefix>) {
  const tc = createTc(t);
  const map: z.ZodErrorMap = (issue, ctx) => {
    const { code } = issue;

    if (code === z.ZodIssueCode.invalid_type) {
      const { expected } = issue;

      if (expected === "number") {
        return {
          message: tc(TRANSLATION_KEYS.MUST_BE_A_NUMBER),
        };
      }
    }

    if (code === z.ZodIssueCode.invalid_enum_value) {
      const onlyTranslatedOptions = issue.options
        .map((option) => (TRANSLATION_KEYS as Record<string, string>)[option])
        .filter((value) => value !== undefined)
        .map((option) => tc(option));
      return {
        message: tc(TRANSLATION_KEYS.SHOULD_BE_ONE_OF_OPTIONS, {
          options: listWithConjunction(
            onlyTranslatedOptions.map(putInQuotes),
            t(TRANSLATION_KEYS.OR),
          ),
        }),
      };
    }

    if (code === z.ZodIssueCode.invalid_string) {
      const { validation } = issue;
      if (typeof validation === "string") {
        let format: string = validation;
        if (format === "email") {
          format = t(TRANSLATION_KEYS.EMAIL, {
            context: CASES.genitive,
          });
        }
        return {
          message: tc(TRANSLATION_KEYS.DOES_NOT_MATCH_FORMAT, {
            format,
          }),
        };
      }
      if ("includes" in validation) {
        const { includes, position } = validation;
        const parts: string[] = [
          tc(TRANSLATION_KEYS.MUST_CONTAIN_STRING, {
            string: includes,
          }),
        ];
        if (typeof position === "number") {
          parts.push(
            t(TRANSLATION_KEYS.STARTING_AT_POSITION_N, {
              n: position,
            }),
          );
        }
        return {
          message: parts.join(EMPTY_STRING),
        };
      }
      if ("startsWith" in validation) {
        return {
          message: tc(TRANSLATION_KEYS.MUST_START_WITH_STRING, {
            string: validation.startsWith,
          }),
        };
      }
      if ("endsWith" in validation) {
        return {
          message: tc(TRANSLATION_KEYS.MUST_END_WITH_STRING, {
            string: validation.endsWith,
          }),
        };
      }
    }

    if (code === z.ZodIssueCode.too_small) {
      const { inclusive, minimum, type, exact } = issue;
      if (type === "string") {
        if (exact) {
          return {
            message: tc(TRANSLATION_KEYS.INCORRECT_NUMBER_OF_CHARACTERS_MUST_BE_EXACTLY_N, {
              n: minimum,
            }),
          };
        }
        const exactMinimum = Number(inclusive ? minimum : Number(minimum) + 1);
        return {
          message: tc(TRANSLATION_KEYS.NOT_ENOUGH_CHARACTERS_AT_LEAST_N_REQUIRED, {
            n: exactMinimum,
            count: exactMinimum,
          }),
        };
      } else if (type === "number") {
        return {
          message: tc(
            inclusive
              ? TRANSLATION_KEYS.MUST_BE_AT_LEAST_N
              : TRANSLATION_KEYS.MUST_BE_GREATER_THAN_N,
            {
              n: minimum,
            },
          ),
        };
      }
    }

    if (code === z.ZodIssueCode.too_big) {
      const { inclusive, maximum, type } = issue;
      if (type === "number") {
        return {
          message: tc(
            inclusive ? TRANSLATION_KEYS.SHOULD_NOT_EXCEED_N : TRANSLATION_KEYS.MUST_BE_LESS_THAN_N,
            {
              n: maximum,
            },
          ),
        };
      }
    }

    if (code === z.ZodIssueCode.not_multiple_of) {
      const { multipleOf } = issue;
      return {
        message: tc(TRANSLATION_KEYS.MUST_BE_A_MULTIPLE_OF_N, {
          n: multipleOf,
        }),
      };
    }

    return {
      message: ctx.defaultError,
    };
  };

  return map;
}

export { errorMapForForms };
