import type { ComponentProps, CSSProperties } from "react";

import { Svg } from "~/shared/ui/svg";

type Props = ComponentProps<typeof Svg> & {
  metal?: "GOLD" | "SILVER" | undefined;
};

function MedalIcon({ metal = "GOLD", ...props }: Props) {
  return (
    <Svg xmlSpace="preserve" viewBox="0 0 120 120" {...props}>
      <path
        d="M79.7 45.6 60 55.5l-19.7-9.9-24.4 48.7 15.2-1.5 7.8 13.1 21.1-42 21.1 42 7.8-13.1 15.2 1.5z"
        style={
          {
            "--fill-color": metal === "GOLD" ? "#e24255" : "#ffbf4b",
          } as CSSProperties
        }
        className="fill-(--fill-color)"
      />
      <circle
        cx="60"
        cy="46.4"
        r="32.2"
        style={
          {
            "--fill-color": metal === "GOLD" ? "#ffc54d" : "#ededed",
          } as CSSProperties
        }
        className="fill-(--fill-color)"
      />
      <circle
        cx="60"
        cy="46.4"
        r="25.3"
        style={
          {
            "--fill-color": metal === "GOLD" ? "#e8b04b" : "#bcbcbc",
          } as CSSProperties
        }
        className="fill-(--fill-color)"
      />
      <path
        d="m61.2 31.2 4.2 8.4c.2.4.6.7 1 .8l9.3 1.4c1.1.2 1.6 1.5.8 2.3l-6.7 6.6c-.3.3-.5.8-.4 1.2l1.6 9.3c.2 1.1-1 2-2 1.4l-8.3-4.4c-.4-.2-.9-.2-1.3 0L51 62.6c-1 .5-2.2-.3-2-1.4l1.6-9.3c.1-.4-.1-.9-.4-1.2l-6.7-6.6c-.8-.8-.4-2.2.8-2.3l9.3-1.4c.4-.1.8-.3 1-.8l4.2-8.4c.5-1 1.9-1 2.4 0z"
        className="fill-[#fff]"
      />
    </Svg>
  );
}

export { MedalIcon };
