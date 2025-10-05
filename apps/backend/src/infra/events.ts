import type EventEmitter from "events";
import { on } from "events";

type EventName = Parameters<typeof on>[1];
type EventMap<T extends EventName> = Record<T, unknown[]>;

function on2<T extends EventMap<string>, K extends Exclude<keyof T, number>>(
  emitter: EventEmitter<T>,
  eventName: K,
  options?: Parameters<typeof on>[2],
) {
  return on(emitter as EventEmitter, eventName, options) as AsyncIterableIterator<T[K]>;
}

export { on2 };
