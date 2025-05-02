import type { Session } from "~/core";

function isSessionExpired({ createdAt, maximumAge }: Pick<Session, "createdAt" | "maximumAge">) {
  return Date.now() > createdAt.getTime() + maximumAge;
}

export { isSessionExpired };
