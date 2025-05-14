import { RouterProvider } from "react-router";

import { AuthResolver } from "./auth-resolver";
import { QueryClientProvider } from "./react-query";
import { router } from "./router";
import { SessionSupporter } from "./session-supporter";
import { ThemeProvider } from "./theming";

import { Toaster } from "~/shared/ui/sonner";

import "./i18n";

function App() {
  return (
    <>
      <Toaster />
      <QueryClientProvider>
        <AuthResolver />
        <SessionSupporter />
        <ThemeProvider>
          <RouterProvider router={router} />
        </ThemeProvider>
      </QueryClientProvider>
    </>
  );
}

export { App };
