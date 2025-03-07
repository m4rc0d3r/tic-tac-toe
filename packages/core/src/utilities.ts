import { isNullish, isObject } from "./type-guards";

type TypeInfo = {
  type:
    | "bigint"
    | "boolean"
    | "function"
    | "null"
    | "number"
    | "object"
    | "string"
    | "symbol"
    | "undefined";
  prototype?: string | undefined;
};

function getTypeInfo(value: unknown): TypeInfo {
  if (isNullish(value)) {
    return {
      type: String(value) as TypeInfo["type"],
    };
  } else if (typeof value === "object") {
    const prototype = Object.getPrototypeOf(value) as unknown;
    if (isObject(prototype) && "name" in prototype.constructor) {
      return {
        type: typeof value,
        prototype: prototype.constructor.name,
      };
    }
  }
  return {
    type: typeof value,
  };
}

export { getTypeInfo };
export type { TypeInfo };
