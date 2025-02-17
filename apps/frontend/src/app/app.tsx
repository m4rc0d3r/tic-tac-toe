import { Configurator } from "./configurator";
import { QueryClientProvider } from "./react-query";

import { Toaster } from "~/shared/ui/sonner";

function App() {
  return (
    <>
      <Configurator />
      <Toaster />
      <QueryClientProvider>
        <></>
      </QueryClientProvider>
    </>
  );
}

export { App };
