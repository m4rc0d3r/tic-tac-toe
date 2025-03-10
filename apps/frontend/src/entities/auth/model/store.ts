import type { WithoutMethods } from "@tic-tac-toe/core";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

import type { Me } from "./me";

import { createSelectors } from "~/shared/lib/zustand";

type AuthenticationStatus = "UNCERTAIN" | "UNAUTHENTICATED" | "AUTHENTICATED";

type State = {
  login: (token: NonNullable<State["token"]>, me: NonNullable<State["me"]>) => void;
  logout: () => void;
  updateMe: (data: Partial<Me>) => void;
  reset: () => void;
} & (
  | {
      status: Extract<AuthenticationStatus, "UNCERTAIN" | "UNAUTHENTICATED">;
      token: null;
      me: null;
    }
  | {
      status: Extract<AuthenticationStatus, "AUTHENTICATED">;
      token: string;
      me: Me;
    }
);

const initialState: WithoutMethods<State> = {
  status: "UNCERTAIN",
  token: null,
  me: null,
};

const useAuthStore = createSelectors(
  create<State>()(
    devtools(
      (set) =>
        ({
          ...initialState,
          login: (token, me) =>
            set({
              status: "AUTHENTICATED",
              token,
              me,
            }),
          logout: () =>
            set({
              ...initialState,
              status: "UNAUTHENTICATED",
            }),
          updateMe: (data) => set(({ me }) => (me ? { me: { ...me, ...data } } : { me })),
          reset: () => set(initialState),
        }) satisfies State,
      {
        store: "AuthStore",
      },
    ),
  ),
);

export { useAuthStore };
