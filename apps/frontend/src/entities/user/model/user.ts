import type { AppRouter } from "@tic-tac-toe/backend";

type User = Awaited<
  ReturnType<AppRouter["_def"]["procedures"]["auth"]["register" | "login"]>
>["me"];

export type { User };
