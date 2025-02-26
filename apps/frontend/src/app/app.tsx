import { RouterProvider } from "react-router";

import { AuthResolver } from "./auth-resolver";
import { Configurator } from "./configurator";
import { QueryClientProvider } from "./react-query";
import { router } from "./router";

import { Toaster } from "~/shared/ui/sonner";

import "./i18n";

function App() {
  return (
    <>
      <Configurator />
      <Toaster />
      <QueryClientProvider>
        <AuthResolver />
        <RouterProvider router={router} />
      </QueryClientProvider>
    </>
  );
}

export { App };
