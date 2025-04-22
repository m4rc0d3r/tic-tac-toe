import { ChevronDown, ChevronUp } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";
import { useState } from "react";

import { Button } from "./button/component";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "./dropdown-menu";
import { cn } from "./utils";

type ExtractedButtonProps = Extract<keyof ComponentProps<typeof Button>, "variant" | "size">;

type Props = Omit<ComponentProps<"div">, "children"> &
  Pick<ComponentProps<typeof Button>, ExtractedButtonProps> & {
    mainButtonProps?: Omit<ComponentProps<typeof Button>, ExtractedButtonProps> | undefined;
    mainButtonChildren?: ComponentProps<typeof Button>["children"] | undefined;
    secondaryButtonsProps?: Omit<ComponentProps<typeof Button>, ExtractedButtonProps> | undefined;
    menuProps?: ComponentProps<typeof DropdownMenu> | undefined;
    menuContentChildren?: ReactNode | undefined;
  };

function ButtonWithDropdown({
  variant,
  size,
  mainButtonProps,
  mainButtonChildren,
  secondaryButtonsProps,
  menuProps,
  menuContentChildren,
  className,
  ...props
}: Props) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { onOpenChange, ...menuProps2 } = menuProps ?? {};

  const handleOpenChange: ComponentProps<typeof DropdownMenu>["onOpenChange"] = (value) => {
    setIsMenuOpen(value);
    onOpenChange?.(value);
  };

  return (
    <div className={cn("flex", className)} {...props}>
      <Button
        variant={variant}
        size={size}
        className="flex-grow rounded-r-none border-r-0 focus:z-0"
        {...mainButtonProps}
      >
        {mainButtonChildren}
      </Button>
      <DropdownMenu onOpenChange={handleOpenChange} {...menuProps2}>
        <DropdownMenuTrigger asChild>
          <Button
            variant={variant}
            size={size}
            className="rounded-l-none border-l-0"
            {...secondaryButtonsProps}
          >
            {isMenuOpen ? <ChevronUp /> : <ChevronDown />}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>{menuContentChildren}</DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export { ButtonWithDropdown };
