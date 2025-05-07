import { Loader } from "lucide-react";
import type { ComponentProps } from "react";

import { cn } from "./utils";

type Props = ComponentProps<typeof Loader>;

function Spinner({ className }: Props) {
  return <Loader className={cn("animate-spin", className)} />;
}

export { Spinner };
