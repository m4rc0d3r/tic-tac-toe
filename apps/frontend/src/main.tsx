import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App.tsx";
import { Configurator } from "./app/configurator.tsx";
import "./index.css";
import TanstackQueryProvider from "./TanstackQueryProvider.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Configurator />
    <TanstackQueryProvider>
      <App />
    </TanstackQueryProvider>
  </StrictMode>,
);
