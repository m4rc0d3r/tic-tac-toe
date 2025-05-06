import { z } from "zod";

import { isTruthy } from "~/primitive";

const zDurationComponent = z.number().int();
type DurationComponent = z.infer<typeof zDurationComponent>;

const zDuration = z
  .object({
    years: zDurationComponent,
    months: zDurationComponent,
    weeks: zDurationComponent,
    days: zDurationComponent,
    hours: zDurationComponent,
    minutes: zDurationComponent,
    seconds: zDurationComponent,
  })
  .partial()
  .transform(
    (value) =>
      Object.fromEntries(
        Object.entries(value).filter(([, value]) => isTruthy(value)),
      ) as typeof value,
  )
  .refine(
    (value) => {
      return Object.values(value).every(
        (component, _index, array) =>
          typeof component === "number" && Math.sign(component) === Math.sign(array[0]!),
      );
    },
    {
      message: "Component signs must be consistent",
    },
  );
type Duration = z.infer<typeof zDuration>;

export { zDuration, zDurationComponent };
export type { Duration, DurationComponent };
