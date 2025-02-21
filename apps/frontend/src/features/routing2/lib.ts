import type { ComponentProps } from "react";

import type { OriginalComponentProps } from "./ui";
import { ProtectedComponent } from "./ui";

type Params<P extends OriginalComponentProps> = ComponentProps<typeof ProtectedComponent<P>>;

function withConditionalAccess<P extends OriginalComponentProps>(params: Params<P>) {
  return () => ProtectedComponent(params);
}

export { withConditionalAccess };
