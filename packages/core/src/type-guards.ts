function isNullish(value: unknown) {
  return value === null || value === undefined;
}

function isObject(value: unknown) {
  return typeof value === "object" && value !== null;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyFunction = (...args: any[]) => any;
type UnknownFunction = (...args: unknown[]) => unknown;

function hasMethod<T extends string>(value: unknown, name: T): value is Record<T, UnknownFunction> {
  if (isNullish(value)) return false;

  return (
    (Object.getOwnPropertyNames(value).includes(name) &&
      typeof (value as Record<string, unknown>)[name] === "function") ||
    hasMethod(Object.getPrototypeOf(value), name)
  );
}

export { hasMethod, isNullish, isObject };
export type { AnyFunction, UnknownFunction };
