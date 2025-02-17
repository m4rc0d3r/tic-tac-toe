import type { WithoutMethods } from "@tic-tac-toe/core";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

import type { Me } from "./me";

type State = {
  login: (token: NonNullable<State["token"]>, me: NonNullable<State["me"]>) => void;
  logout: () => void;
  reset: () => void;
} & (
  | {
      isAuthenticated: false;
      token: null;
      me: null;
    }
  | {
      isAuthenticated: true;
      token: string;
      me: Me;
    }
);

const initialState: WithoutMethods<State> = {
  isAuthenticated: false,
  token: null,
  me: null,
};

const useAuthStore = create<State>()(
  devtools(
    (set) =>
      ({
        ...initialState,
        login: (token, me) =>
          set({
            isAuthenticated: true,
            token,
            me,
          }),
        logout: () => set(initialState),
        reset: () => set(initialState),
      }) satisfies State,
    {
      store: "AuthStore",
    },
  ),
);

export { useAuthStore };
