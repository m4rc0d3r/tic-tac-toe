import throttle from "lodash/throttle";
import { useEffect, useRef } from "react";

import { useAuthStore } from "~/entities/auth";
import { trpc } from "~/shared/api";
import { useConfigStore } from "~/shared/config";
import { UserActivity } from "~/shared/lib/user-activity";

function SessionSupporter() {
  const { lastAccessDateUpdateInterval } = useConfigStore.use.session();
  const { mutate: updateLastAccessDate } = trpc.sessions.updateLastAccessDate.useMutation();
  const me = useAuthStore.use.me();
  const userActivityRef = useRef(new UserActivity(lastAccessDateUpdateInterval * 0.9));

  useEffect(() => {
    const userActivity = userActivityRef.current;
    userActivity.initialize();

    return () => {
      userActivity.deinitialize();
    };
  }, []);

  useEffect(() => {
    if (!me) return;

    const controller = new AbortController();
    const { signal } = controller;

    const throttledUpdateLastAccessDate = throttle(() => {
      updateLastAccessDate();
    }, lastAccessDateUpdateInterval);

    const userActivity = userActivityRef.current;

    userActivity.addEventListener(
      "USER_PERFORMED_ACTION",
      () => {
        throttledUpdateLastAccessDate();
      },
      {
        signal,
      },
    );
    userActivity.addEventListener(
      "ACTIVITY_CHANGED",
      ({ detail: { isActive } }) => {
        if (isActive) return;

        throttledUpdateLastAccessDate.cancel();
      },
      {
        signal,
      },
    );

    window.addEventListener(
      "beforeunload",
      () => {
        updateLastAccessDate();
      },
      {
        signal,
      },
    );

    return () => {
      controller.abort();
    };
  }, [lastAccessDateUpdateInterval, me, updateLastAccessDate]);

  return null;
}

export { SessionSupporter };
