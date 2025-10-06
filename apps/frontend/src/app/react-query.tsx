import {
  QueryClient,
  QueryClientProvider as ReactQueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
  httpLink,
  isNonJsonSerializable,
  splitLink,
  unstable_httpSubscriptionLink,
} from "@trpc/client";
import type { ReactNode } from "react";
import { useState } from "react";
import superjson from "superjson";

import { trpc } from "~/shared/api";
import { useConfigStore } from "~/shared/config";

type Props = {
  children: ReactNode;
};

function QueryClientProvider({ children }: Props) {
  const backendApp = useConfigStore.use.backendApp();
  const { prefix } = useConfigStore.use.trpc();

  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() => {
    const url = [backendApp.url(), prefix].join("/");
    const customFetch: Parameters<typeof httpLink>[0]["fetch"] = (input, init) =>
      fetch(input, {
        ...init,
        credentials: "include",
        signal: init?.signal ?? null,
      } as RequestInit);

    return trpc.createClient({
      links: [
        splitLink({
          condition: ({ input }) => isNonJsonSerializable(input),
          true: httpLink({
            url,
            fetch: customFetch,
            transformer: {
              serialize: (object: unknown) => object,
              deserialize: (object: unknown) => object,
            },
          }),
          false: splitLink({
            condition: ({ type }) => type === "subscription",
            true: unstable_httpSubscriptionLink({
              url,
              eventSourceOptions: {
                withCredentials: true,
              },
              transformer: superjson,
            }),
            false: httpLink({
              url,
              fetch: customFetch,
              transformer: superjson,
            }),
          }),
        }),
      ],
    });
  });
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
