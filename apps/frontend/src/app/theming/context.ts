import { createContext, useContext } from "react";

const THEMES = ["light", "dark", "system"] as const;
type Theme = (typeof THEMES)[number];

type ThemeState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const initialState: ThemeState = {
  theme: "system",
  setTheme: () => void 0,
};

const ThemeContext = createContext<ThemeState>(initialState);

const useTheme = () => {
  const context = useContext(ThemeContext);

  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
};

export { ThemeContext, THEMES, useTheme };
export type { Theme, ThemeState };
