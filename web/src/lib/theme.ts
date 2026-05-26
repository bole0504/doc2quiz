import { themeToCssVars, type PaletteId } from "@docx2quiz/tokens";

export function applyThemeAttrs(
  el: HTMLElement,
  options: { palette?: PaletteId; dark?: boolean }
) {
  const vars = themeToCssVars(options);
  for (const [k, v] of Object.entries(vars)) {
    el.style.setProperty(k, v);
  }
  if (options.dark) el.setAttribute("data-theme", "dark");
  else el.removeAttribute("data-theme");
}
