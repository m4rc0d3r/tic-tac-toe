import { useEffect } from "react";

import { useAuthStore } from "~/entities/auth";
import { trpc } from "~/shared/api";

function AuthResolver() {
  const { data: me, error } = trpc.users.getMe.useQuery(void 0, {
    retry: false,
  });
  const loginLocally = useAuthStore.use.login();
  const logoutLocally = useAuthStore.use.logout();

  useEffect(() => {
    if (!(me || error)) return;

    if (me) {
      loginLocally(me);
    } else if (error) {
      logoutLocally();
    }
  }, [error, loginLocally, logoutLocally, me]);

  return null;
}

export { AuthResolver };
