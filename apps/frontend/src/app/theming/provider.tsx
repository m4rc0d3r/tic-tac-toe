import type { ReactNode } from "react";
import { useEffect } from "react";

import type { Theme } from "./context";
import { ThemeContext } from "./context";

import { usePersistedState } from "~/shared/lib/state";

type Props = {
  storageKey?: string;
  defaultTheme?: Theme;
  children?: ReactNode | undefined;
};

function ThemeProvider({
  storageKey = "vite-ui-theme",
  defaultTheme = "system",
  children,
  ...props
}: Props) {
  const [theme, setTheme] = usePersistedState(storageKey, defaultTheme);

  useEffect(() => {
    const root = window.document.documentElement;

    root.classList.remove("light", "dark");

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";

      root.classList.add(systemTheme);
      return;
    }

    root.classList.add(theme);
  }, [theme]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
      }}
      {...props}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export { ThemeProvider };
