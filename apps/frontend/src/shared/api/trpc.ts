import type { AppRouter } from "@tic-tac-toe/backend";
import { createTRPCReact } from "@trpc/react-query";

const trpc: ReturnType<typeof createTRPCReact<AppRouter>> = createTRPCReact<AppRouter>();

export { trpc };
