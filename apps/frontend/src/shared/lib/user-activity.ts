import debounce from "lodash/debounce";

class UserActivity {
  private eventTarget = new EventTarget();
  private controller: AbortController | null = null;
  private lastActiveAt = new Date(0);
  private _inactionThreshold = 0;

  constructor(inactionThreshold: number) {
    this._inactionThreshold = inactionThreshold;
  }

  isActive() {
    return Date.now() - this.lastActiveAt.getTime() <= this._inactionThreshold;
  }

  getLastActivityDate() {
    return this.lastActiveAt;
  }

  isInitialized() {
    return this.controller !== null;
  }

  initialize() {
    if (this.isInitialized()) return;

    this.controller = new AbortController();
    const { signal } = this.controller;

    const dispatchActivityChangeEvent = (
      isActive: UserActivityEventMap["ACTIVITY_CHANGED"]["detail"]["isActive"],
    ) => {
      this.dispatchEvent("ACTIVITY_CHANGED", { isActive });
    };

    const scheduleUserInactivityNotification = debounce(() => {
      dispatchActivityChangeEvent(false);
    }, this._inactionThreshold);

    for (const { type, refinement } of EVENT_CHECKS as ReturnType<typeof createEventCheck>[]) {
      window.addEventListener(
        type,
        (event) => {
          if (!refinement(event)) return;

          scheduleUserInactivityNotification();

          const prevIsActive = this.isActive();
          this.lastActiveAt = new Date();

          this.dispatchEvent("USER_PERFORMED_ACTION", {
            action: event,
          } as UserActivityEventMap["USER_PERFORMED_ACTION"]["detail"]);
          if (prevIsActive) return;

          dispatchActivityChangeEvent(true);
        },
        { signal },
      );
    }
  }

  deinitialize() {
    if (!this.controller) return;

    this.controller.abort();
    this.controller = null;
  }

  addEventListener<K extends keyof UserActivityEventMap>(
    type: K,
    listener: (event: UserActivityEventMap[K]) => void,
    options?: boolean | AddEventListenerOptions,
  ) {
    this.eventTarget.addEventListener(
      type,
      listener as EventListenerOrEventListenerObject | null,
      options,
    );
  }

  removeEventListener<K extends keyof UserActivityEventMap>(
    type: K,
    listener: (event: UserActivityEventMap[K]) => void,
    options?: boolean | EventListenerOptions,
  ) {
    this.eventTarget.removeEventListener(
      type,
      listener as EventListenerOrEventListenerObject | null,
      options,
    );
  }

  private dispatchEvent<K extends keyof UserActivityEventMap>(
    type: K,
    detail: UserActivityEventMap[K]["detail"],
  ) {
    this.eventTarget.dispatchEvent(
      new CustomEvent(type, {
        detail,
      }),
    );
  }
}

function createEventCheck<K extends keyof WindowEventMap>(
  type: K,
  refinement: (event: WindowEventMap[K]) => boolean = () => true,
) {
  return {
    type,
    refinement: (event: WindowEventMap[K]) => {
      return event.isTrusted && refinement(event);
    },
  };
}

const EVENT_CHECKS = [
  createEventCheck("keydown"),
  createEventCheck("mousedown"),
  createEventCheck("pointerdown", ({ pointerType }) => pointerType === "mouse"),
  createEventCheck("pointerup", ({ pointerType }) => pointerType !== "mouse"),
  createEventCheck("touchend"),
];

type UserActivityEventMap = {
  ACTIVITY_CHANGED: CustomEvent<{
    isActive: boolean;
  }>;
  USER_PERFORMED_ACTION: CustomEvent<{
    action: Parameters<(typeof EVENT_CHECKS)[number]["refinement"]>[0];
  }>;
};

export { UserActivity };
export type { UserActivityEventMap };
