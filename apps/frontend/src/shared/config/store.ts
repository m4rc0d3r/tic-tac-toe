import { create } from "zustand";
import { devtools } from "zustand/middleware";

import { createSelectors } from "../lib/zustand";

import type { Config } from "./config";

const initialState: Config = {
  backendApp: {
    protocol: "",
    address: "",
    port: 0,
    url: function (): string {
      throw new Error("Function not implemented.");
    },
  },
  trpc: {
    prefix: "",
  },
};

const useConfigStore = createSelectors(
  create<Config>()(
    devtools(() => initialState, {
      store: "ConfigStore",
    }),
  ),
);

export { useConfigStore };
