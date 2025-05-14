import { useEffect } from "react";

import { useAuthStore } from "~/entities/auth";
import { trpc } from "~/shared/api";
import { useConfigStore } from "~/shared/config";

function SessionSupporter() {
  const { lastAccessDateUpdateInterval } = useConfigStore.use.session();
  const { mutate: updateLastAccessDate } = trpc.sessions.updateLastAccessDate.useMutation();
  const me = useAuthStore.use.me();

  useEffect(() => {
    if (!me) return;

    const intervalId = setInterval(() => {
      updateLastAccessDate();
    }, lastAccessDateUpdateInterval);

    const controller = new AbortController();
    const { signal } = controller;
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
      clearInterval(intervalId);
    };
  }, [lastAccessDateUpdateInterval, me, updateLastAccessDate]);

  return null;
}

export { SessionSupporter };
