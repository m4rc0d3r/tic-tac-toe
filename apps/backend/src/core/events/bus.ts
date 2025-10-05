import type EventEmitter from "events";

import type { EventMap } from "./map";

type EventBus = EventEmitter<EventMap>;

export type { EventBus };
