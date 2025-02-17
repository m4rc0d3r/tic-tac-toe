import * as SeparatorPrimitive from "@radix-ui/react-separator";
import * as React from "react";

import { cn } from "./utils";

type SeparatorProps = React.ComponentProps<typeof SeparatorPrimitive.Root> & {
  thickness?: string | undefined;
};

function Separator({
  className,
  orientation = "horizontal",
  decorative = true,
  thickness = "2px",
  ...props
}: SeparatorProps) {
  return (
    <SeparatorPrimitive.Root
      data-slot="separator-root"
      decorative={decorative}
      orientation={orientation}
      style={
        {
          "--thickness": thickness,
        } as React.CSSProperties
      }
      className={cn(
        `bg-border shrink-0 data-[orientation=horizontal]:h-[var(--thickness)] data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-[var(--thickness)]`,
        className,
      )}
      {...props}
    />
  );
}

export { Separator };
