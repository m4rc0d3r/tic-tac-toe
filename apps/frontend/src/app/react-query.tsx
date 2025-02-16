import {
  QueryClient,
  QueryClientProvider as ReactQueryClientProvider,
} from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import type { ReactNode } from "react";
import { useState } from "react";

import { trpc } from "~/shared/api";
import { useConfigStore } from "~/shared/config";

type QueryClientProviderProps = {
  children: ReactNode;
};

function QueryClientProvider({ children }: QueryClientProviderProps) {
  const {
    backendApp,
    trpc: { prefix },
  } = useConfigStore();

  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: [backendApp.url(), prefix].join("/"),
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
