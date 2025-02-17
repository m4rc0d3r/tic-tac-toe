type WithoutMethods<T extends Record<string, unknown>> = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [K in keyof T as T[K] extends (...args: any[]) => any ? never : K]: T[K];
};

export type { WithoutMethods };
