import { zEventMap } from "./map";

const EventName = zEventMap.keyof().Enum;
type EventName = keyof typeof EventName;

export { EventName, zEventMap };
