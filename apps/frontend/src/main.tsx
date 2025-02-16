import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App.tsx";
import { Configurator } from "./app/configurator.tsx";
import { QueryClientProvider } from "./app/react-query.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Configurator />
    <QueryClientProvider>
      <App />
    </QueryClientProvider>
  </StrictMode>,
);
