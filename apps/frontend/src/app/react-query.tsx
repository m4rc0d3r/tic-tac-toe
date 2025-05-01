import {
  QueryClient,
  QueryClientProvider as ReactQueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { httpLink } from "@trpc/client";
import type { ReactNode } from "react";
import { useState } from "react";

import { trpc } from "~/shared/api";
import { useConfigStore } from "~/shared/config";

type Props = {
  children: ReactNode;
};

function QueryClientProvider({ children }: Props) {
  const backendApp = useConfigStore.use.backendApp();
  const { prefix } = useConfigStore.use.trpc();

  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpLink({
          url: [backendApp.url(), prefix].join("/"),
          fetch: (input, options) =>
            fetch(input, {
              ...options,
              credentials: "include",
              signal: options?.signal ?? null,
            }),
        }),
      ],
    }),
  );
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <ReactQueryClientProvider client={queryClient}>
        {children}
        <ReactQueryDevtools />
      </ReactQueryClientProvider>
    </trpc.Provider>
  );
}

export { QueryClientProvider };
