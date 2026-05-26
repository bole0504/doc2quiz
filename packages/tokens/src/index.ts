export type PaletteId =
  | "indigo"
  | "violet"
  | "blue"
  | "sky"
  | "cyan"
  | "teal"
  | "emerald"
  | "lime"
  | "amber"
  | "orange"
  | "rose"
  | "pink"
  | "slate";

export type ThemeMode = "light" | "dark";

export const PALETTE_IDS: PaletteId[] = [
  "indigo",
  "violet",
  "blue",
  "sky",
  "cyan",
  "teal",
  "emerald",
  "lime",
  "amber",
  "orange",
  "rose",
  "pink",
  "slate",
];

export const PALETTES: Record<
  PaletteId,
  { p: string; pHover: string; pSoft: string; pSoftText: string }
> = {
  indigo: { p: "#5B5BD6", pHover: "#4F4FCB", pSoft: "#EEF0FF", pSoftText: "#3D3DAB" },
  violet: { p: "#7C3AED", pHover: "#6D28D9", pSoft: "#F3EEFF", pSoftText: "#5B21B6" },
  blue: { p: "#2563EB", pHover: "#1D4ED8", pSoft: "#EAF1FF", pSoftText: "#1E40AF" },
  sky: { p: "#0284C7", pHover: "#0369A1", pSoft: "#E4F4FD", pSoftText: "#075985" },
  cyan: { p: "#0891B2", pHover: "#0E7490", pSoft: "#E0F6FA", pSoftText: "#155E75" },
  teal: { p: "#0D9488", pHover: "#0F766E", pSoft: "#E0F5F2", pSoftText: "#115E59" },
  emerald: { p: "#10B981", pHover: "#059669", pSoft: "#E6FAF3", pSoftText: "#047857" },
  lime: { p: "#65A30D", pHover: "#4D7C0F", pSoft: "#F0F8DD", pSoftText: "#3F6212" },
  amber: { p: "#F59E0B", pHover: "#D97706", pSoft: "#FEF5E7", pSoftText: "#B45309" },
  orange: { p: "#EA580C", pHover: "#C2410C", pSoft: "#FFEEDD", pSoftText: "#9A3412" },
  rose: { p: "#F43F5E", pHover: "#E11D48", pSoft: "#FFEEF1", pSoftText: "#BE123C" },
  pink: { p: "#DB2777", pHover: "#BE185D", pSoft: "#FCE8F1", pSoftText: "#9D174D" },
  slate: { p: "#475569", pHover: "#334155", pSoft: "#EEF1F5", pSoftText: "#1E293B" },
};

export const LIGHT = {
  bg: "#FFFFFF",
  bgMuted: "#FAFAFA",
  bgSubtle: "#F4F4F5",
  border: "#E4E4E7",
  borderStrong: "#D4D4D8",
  text: "#09090B",
  textMuted: "#52525B",
  textSubtle: "#71717A",
  inputBg: "#FFFFFF",
  cardShadow: "0 1px 2px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.04)",
  success: "#10B981",
  successSoft: "#E6FAF3",
  warning: "#F59E0B",
  warningSoft: "#FEF5E7",
  danger: "#EF4444",
  dangerSoft: "#FEE7E7",
} as const;

export const DARK = {
  bg: "#0A0A0B",
  bgMuted: "#111113",
  bgSubtle: "#18181B",
  border: "#27272A",
  borderStrong: "#3F3F46",
  text: "#FAFAFA",
  textMuted: "#A1A1AA",
  textSubtle: "#71717A",
  inputBg: "#18181B",
  cardShadow: "0 1px 2px rgba(0,0,0,0.4), 0 1px 3px rgba(0,0,0,0.3)",
  success: "#34D399",
  successSoft: "#0E2A22",
  warning: "#FBBF24",
  warningSoft: "#2A1F0A",
  danger: "#F87171",
  dangerSoft: "#2A1212",
} as const;

export type ThemeModeTokens = {
  bg: string;
  bgMuted: string;
  bgSubtle: string;
  border: string;
  borderStrong: string;
  text: string;
  textMuted: string;
  textSubtle: string;
  inputBg: string;
  cardShadow: string;
  success: string;
  successSoft: string;
  warning: string;
  warningSoft: string;
  danger: string;
  dangerSoft: string;
};

export type ThemeTokens = ThemeModeTokens & {
  p: string;
  pHover: string;
  pSoft: string;
  pSoftText: string;
};

export function getThemeTokens(options: {
  palette?: PaletteId;
  dark?: boolean;
}): ThemeTokens {
  const palette = options.palette ?? "indigo";
  const mode = options.dark ? DARK : LIGHT;
  const p = PALETTES[palette] ?? PALETTES.indigo;
  return { ...mode, ...p };
}

/** CSS custom property map for :root or a scoped element */
export function themeToCssVars(options: {
  palette?: PaletteId;
  dark?: boolean;
}): Record<string, string> {
  const t = getThemeTokens(options);
  return {
    "--p": t.p,
    "--pHover": t.pHover,
    "--pSoft": t.pSoft,
    "--pSoftText": t.pSoftText,
    "--bg": t.bg,
    "--bgMuted": t.bgMuted,
    "--bgSubtle": t.bgSubtle,
    "--border": t.border,
    "--borderStrong": t.borderStrong,
    "--text": t.text,
    "--textMuted": t.textMuted,
    "--textSubtle": t.textSubtle,
    "--inputBg": t.inputBg,
    "--cardShadow": t.cardShadow,
    "--success": t.success,
    "--successSoft": t.successSoft,
    "--warning": t.warning,
    "--warningSoft": t.warningSoft,
    "--danger": t.danger,
    "--dangerSoft": t.dangerSoft,
    "--colorScheme": options.dark ? "dark" : "light",
  };
}

export const AVATAR_COLORS = [
  "#5B5BD6",
  "#10B981",
  "#F59E0B",
  "#F43F5E",
  "#8B5CF6",
  "#06B6D4",
];

export function avatarColor(name: string): string {
  return AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];
}
