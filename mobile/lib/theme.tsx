import { createContext, useContext, useMemo, type ReactNode } from "react";
import { getThemeTokens } from "@docx2quiz/tokens";

export type AppTheme = ReturnType<typeof getThemeTokens>;

const ThemeContext = createContext<AppTheme>(getThemeTokens({}));

export function ThemeProvider({ children }: { children: ReactNode }) {
  const theme = useMemo(() => getThemeTokens({ palette: "indigo", dark: false }), []);
  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}
