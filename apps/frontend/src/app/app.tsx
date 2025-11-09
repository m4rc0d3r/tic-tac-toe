import { useEffect } from "react";
import { RouterProvider } from "react-router";

import { AuthResolver } from "./auth-resolver";
import { QueryClientProvider } from "./react-query";
import { router } from "./router";
import { SessionSupporter } from "./session-supporter";
import { SessionTerminator } from "./session-terminator";
import { ThemeProvider } from "./theming";

import { TRANSLATION_KEYS, useTranslation2 } from "~/shared/i18n";
import { Toaster } from "~/shared/ui/sonner";
import "./i18n";

function App() {
  const {
    translation: {
      i18n: { language },
    },
    postproc: { tc },
  } = useTranslation2();
  useEffect(() => {
    document.title = tc(TRANSLATION_KEYS.TIC_TAC_TOE);
  }, [tc, language]);

  return (
    <>
      <Toaster />
      <QueryClientProvider>
        <AuthResolver />
        <SessionSupporter />
        <SessionTerminator />
        <ThemeProvider>
          <RouterProvider router={router} />
        </ThemeProvider>
      </QueryClientProvider>
    </>
  );
}

export { App };
