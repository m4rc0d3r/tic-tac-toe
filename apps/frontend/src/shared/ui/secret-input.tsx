import { Eye, EyeOff } from "lucide-react";
import type { ComponentProps } from "react";
import { useRef, useState } from "react";

import { Button } from "./button";
import { Input } from "./input";
import { cn } from "./utils";

type Props = ComponentProps<"div"> & {
  onShowContentChange?: ((value: boolean) => void) | undefined;
  inputProps?: Omit<ComponentProps<typeof Input>, "type"> | undefined;
  buttonProps?: ComponentProps<typeof Button> | undefined;
};

function SecretInput({
  onShowContentChange,
  inputProps: { ref: inputRef, className: inputClassName, ...inputProps } = {},
  buttonProps: { className: buttonClassName, ...buttonProps } = {},
  className,
  ...props
}: Props) {
  const [showContent, setShowContent] = useState(false);
  const inputRef_ = useRef<HTMLInputElement>(null);

  return (
    <div className={cn("relative", className)} {...props}>
      <Input
        ref={(instance) => {
          inputRef_.current = instance;
          if (!inputRef) return;

          if (typeof inputRef === "function") {
            inputRef(instance);
          } else {
            inputRef.current = instance;
          }
        }}
        type={showContent ? "text" : "password"}
        className={cn("pr-9", inputClassName)}
        {...inputProps}
      />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className={cn("absolute top-0 right-0", buttonClassName)}
        onClick={() => {
          const newShowContent = !showContent;
          setShowContent(newShowContent);
          onShowContentChange?.(newShowContent);

          const input = inputRef_.current;
          if (!input) return;

          const { selectionStart, selectionEnd, selectionDirection } = input;
          setTimeout(() => {
            input.setSelectionRange(
              ...(Object.values({ selectionStart, selectionEnd, selectionDirection }) as Parameters<
                HTMLInputElement["setSelectionRange"]
              >),
            );
            input.focus();
          }, 0);
        }}
        {...buttonProps}
      >
        {showContent ? <Eye /> : <EyeOff />}
      </Button>
    </div>
  );
}

export { SecretInput };
