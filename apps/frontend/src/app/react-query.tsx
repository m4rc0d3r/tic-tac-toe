import {
  QueryClient,
  QueryClientProvider as ReactQueryClientProvider,
} from "@tanstack/react-query";
import { SPACE } from "@tic-tac-toe/core";
import { httpBatchLink } from "@trpc/client";
import type { ReactNode } from "react";
import { useState } from "react";

import { useAuthStore } from "~/entities/auth";
import { trpc } from "~/shared/api";
import { useConfigStore } from "~/shared/config";

type Props = {
  children: ReactNode;
};

function QueryClientProvider({ children }: Props) {
  const backendApp = useConfigStore.use.backendApp();
  const { prefix } = useConfigStore.use.trpc();
  const token = useAuthStore.use.token();

  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: [backendApp.url(), prefix].join("/"),
          fetch: (input, options) =>
            fetch(input, {
              ...options,
              credentials: "include",
              signal: options?.signal ?? null,
            }),
          headers: () => ({
            authorization: ["Bearer", token].join(SPACE),
          }),
        }),
      ],
    }),
  );
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <ReactQueryClientProvider client={queryClient}>{children}</ReactQueryClientProvider>
    </trpc.Provider>
  );
}

export { QueryClientProvider };
