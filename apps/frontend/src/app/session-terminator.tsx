import { useEffect } from "react";
import { toast } from "sonner";

import { useAuthStore } from "~/entities/auth";
import { trpc } from "~/shared/api";
import { TRANSLATION_KEYS, useTranslation2 } from "~/shared/i18n";

function SessionTerminator() {
  const {
    postproc: { tc, tsp },
  } = useTranslation2();

  const {
    data: { id } = {},
    reset,
    status,
  } = trpc.sessions.onCurrentSessionTerminated.useSubscription();
  const me = useAuthStore.use.me();
  const logoutLocally = useAuthStore.use.logout();

  useEffect(() => {
    if (me && typeof id === "string") {
      logoutLocally();
      toast.info(tc(TRANSLATION_KEYS.CURRENT_SESSION_TERMINATED), {
        description: tsp(TRANSLATION_KEYS.YOUR_SESSION_WAS_TERMINATED_BY_ANOTHER_SESSION),
      });
    }

    if (me && (["idle", "error"] satisfies (typeof status)[] as string[]).includes(status)) {
      reset();
    }
  }, [id, logoutLocally, me, reset, status, tc, tsp]);

  return null;
}

export { SessionTerminator };
