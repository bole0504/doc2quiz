import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import * as SecureStore from "expo-secure-store";
import { getThemeTokens, PALETTE_IDS, type PaletteId } from "@docx2quiz/tokens";

export type AppTheme = ReturnType<typeof getThemeTokens>;

const THEME_KEY = "docx2quiz_theme";

interface ThemeContextValue {
  theme: AppTheme;
  palette: PaletteId;
  dark: boolean;
  setPalette: (p: PaletteId) => void;
  setDark: (d: boolean) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: getThemeTokens({}),
  palette: "indigo",
  dark: false,
  setPalette: () => {},
  setDark: () => {},
});

export { PALETTE_IDS };
export type { PaletteId };

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [palette, setPaletteState] = useState<PaletteId>("indigo");
  const [dark, setDarkState] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    SecureStore.getItemAsync(THEME_KEY)
      .then((raw) => {
        if (!raw) return;
        const saved = JSON.parse(raw) as { palette?: PaletteId; dark?: boolean };
        if (saved.palette && PALETTE_IDS.includes(saved.palette)) setPaletteState(saved.palette);
        if (typeof saved.dark === "boolean") setDarkState(saved.dark);
      })
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, []);

  const save = useCallback((p: PaletteId, d: boolean) => {
    SecureStore.setItemAsync(THEME_KEY, JSON.stringify({ palette: p, dark: d })).catch(() => {});
  }, []);

  const setPalette = useCallback(
    (p: PaletteId) => { setPaletteState(p); save(p, dark); },
    [dark, save]
  );

  const setDark = useCallback(
    (d: boolean) => { setDarkState(d); save(palette, d); },
    [palette, save]
  );

  const theme = useMemo(() => getThemeTokens({ palette, dark }), [palette, dark]);

  if (!loaded) return null;

  return (
    <ThemeContext.Provider value={{ theme, palette, dark, setPalette, setDark }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext).theme;
}

export function useThemeControls() {
  const { palette, dark, setPalette, setDark } = useContext(ThemeContext);
  return { palette, dark, setPalette, setDark };
}
