import type { AppRouter } from "@tic-tac-toe/backend";
import { createTRPCReact } from "@trpc/react-query";

const trpc: ReturnType<typeof createTRPCReact<AppRouter>> = createTRPCReact<AppRouter>();

type TrpcErrorCause = ReturnType<AppRouter["_def"]["_config"]["errorFormatter"]>["cause"];

export { trpc };
export type { TrpcErrorCause };
