import type { ComponentProps } from "react";
import { Link } from "react-router";

import { cn } from "./utils";

type Props = ComponentProps<typeof Link>;

function Link2({ className, children, ...props }: Props) {
  return (
    <Link
      className={cn("text-link-foreground underline-offset-4 hover:underline", className)}
      {...props}
    >
      {children}
    </Link>
  );
}

export { Link2 };
