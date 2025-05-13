import type { Mutation, MutationFilters, MutationState } from "@tanstack/react-query";
import { useMutationState } from "@tanstack/react-query";
import type { AppRouter } from "@tic-tac-toe/backend";
import { createTRPCReact, getMutationKey } from "@trpc/react-query";

const trpc: ReturnType<typeof createTRPCReact<AppRouter>> = createTRPCReact<AppRouter>();

type TrpcErrorCause = ReturnType<AppRouter["_def"]["_config"]["errorFormatter"]>["cause"];

type ProcedureConstraint = Parameters<typeof getMutationKey>[0];

type UseMutationParams<Procedure extends ProcedureConstraint> = NonNullable<
  Parameters<Procedure["useMutation"]>[0]
>;

type UseMutationOnSuccessParams<Procedure extends ProcedureConstraint> = Parameters<
  NonNullable<UseMutationParams<Procedure>["onSuccess"]>
>;

type MutationData<Procedure extends ProcedureConstraint> = UseMutationOnSuccessParams<Procedure>[0];

type MutationErr<Procedure extends ProcedureConstraint> = Parameters<
  NonNullable<UseMutationParams<Procedure>["onError"]>
>[0];

type MutationVars<Procedure extends ProcedureConstraint> = UseMutationOnSuccessParams<Procedure>[1];

type MutationCtx<Procedure extends ProcedureConstraint> = UseMutationOnSuccessParams<Procedure>[2];

type TrpcMutationStateOptions<Procedure extends ProcedureConstraint, Result = MutationState> = {
  filters?: Omit<
    MutationFilters<
      MutationData<Procedure>,
      MutationErr<Procedure>,
      MutationVars<Procedure>,
      MutationCtx<Procedure>
    >,
    "mutationKey"
  >;
  select?: (
    mutation: Mutation<
      MutationData<Procedure>,
      MutationErr<Procedure>,
      MutationVars<Procedure>,
      MutationCtx<Procedure>
    >,
  ) => Result;
};

function useTrpcMutationState<Procedure extends ProcedureConstraint, Result = MutationState>(
  procedure: Procedure,
  options?: TrpcMutationStateOptions<Procedure, Result>,
  queryClient?: Parameters<typeof useMutationState>[1],
) {
  return useMutationState(
    {
      ...options,
      filters: { mutationKey: getMutationKey(procedure), ...options?.filters },
    } as unknown as Parameters<typeof useMutationState<Result>>[0],
    queryClient,
  );
}

export { trpc, useTrpcMutationState };
export type { TrpcErrorCause };
