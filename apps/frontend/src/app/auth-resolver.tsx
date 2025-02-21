import { useEffect } from "react";

import { useAuthStore } from "~/entities/auth";
import { trpc } from "~/shared/api";

function AuthResolver() {
  const { mutate: refresh } = trpc.auth.refresh.useMutation();
  const loginLocally = useAuthStore.use.login();
  const logoutLocally = useAuthStore.use.logout();

  useEffect(() => {
    refresh(
      {},
      {
        onSuccess: ({ accessToken, me }) => {
          loginLocally(accessToken, me);
        },
        onError: () => {
          logoutLocally();
        },
      },
    );
  }, [loginLocally, logoutLocally, refresh]);

  return null;
}

export { AuthResolver };
