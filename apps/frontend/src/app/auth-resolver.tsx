import { useEffect } from "react";

import { useAuthStore } from "~/entities/auth";
import { trpc } from "~/shared/api";

function AuthResolver() {
  const { data: me } = trpc.users.getMe.useQuery();
  const loginLocally = useAuthStore.use.login();
  const logoutLocally = useAuthStore.use.logout();

  useEffect(() => {
    if (me === undefined) return;

    if (me) {
      loginLocally(me);
    } else {
      logoutLocally();
    }
  }, [loginLocally, logoutLocally, me]);

  return null;
}

export { AuthResolver };
