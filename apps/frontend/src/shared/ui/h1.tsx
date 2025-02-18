import type { ComponentProps } from "react";

import { cn } from "./utils";

function H1({ className, ...props }: ComponentProps<"h1">) {
  return (
    <h1
      className={cn("scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl", className)}
      {...props}
    />
  );
}

export { H1 };
