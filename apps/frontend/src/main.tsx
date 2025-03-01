import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { App } from "./app";
import "./index.css";
import { createConfig, useConfigStore } from "./shared/config";

useConfigStore.setState(createConfig(import.meta.env));

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
