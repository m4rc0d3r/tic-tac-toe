import type { Attributes, ComponentProps, ComponentType, ReactNode } from "react";
import { createElement } from "react";
import { Navigate } from "react-router";

import { useAuthStore } from "~/entities/auth";
import { ROUTES } from "~/shared/routing";

type AllowAccessFor = Extract<
  ReturnType<typeof useAuthStore.use.status>,
  "UNAUTHENTICATED" | "AUTHENTICATED"
>;

type OriginalComponentProps = Attributes | null | undefined;

type Props<P extends OriginalComponentProps> = {
  component: ComponentType;
  props?: P;
  children?: ReactNode | undefined;
  redirectTo?: ComponentProps<typeof Navigate>["to"] | undefined;
  allowFor: AllowAccessFor;
};

function ProtectedComponent<P extends OriginalComponentProps>({
  component,
  props,
  children,
  redirectTo = ROUTES.home,
  allowFor,
}: Props<P>) {
  const authStatus = useAuthStore.use.status();

  if (authStatus === "UNCERTAIN") {
    return null;
  }

  if (allowFor !== authStatus) {
    return <Navigate to={redirectTo} />;
  }

  return createElement(component, props, children);
}

export { ProtectedComponent };
export type { OriginalComponentProps };
