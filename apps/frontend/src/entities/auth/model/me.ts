import type { AppRouter } from "@tic-tac-toe/backend";

type Me = Awaited<ReturnType<AppRouter["_def"]["procedures"]["auth"]["register" | "login"]>>["me"];

export type { Me };
