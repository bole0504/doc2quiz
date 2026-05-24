import type { CorrectAnswerRule } from "@/lib/docx/parseQuizDocxStyled";

function toSizeHalfPoints(size: string | undefined) {
  if (!size) return undefined;
  const raw = size.trim().toLowerCase().replace(/pt$/i, "").trim();
  if (!raw) return undefined;
  // If user typed points (e.g. 13.5) => half-points = 27
  if (raw.includes(".")) {
    const points = Number(raw);
    if (!Number.isFinite(points) || points <= 0) return undefined;
    return String(Math.round(points * 2));
  }
  // Otherwise treat as already in half-points (e.g. 27)
  return raw;
}

function normalizeHexColor(input: string | undefined) {
  if (!input) return undefined;
  const raw = input.trim();
  if (!raw) return undefined;
  const hex = raw.startsWith("#") ? raw.slice(1) : raw;
  if (!/^[0-9a-fA-F]{3,6}$/.test(hex)) return undefined;
  return hex.toUpperCase();
}

export function ruleFromFormData(formData: FormData): CorrectAnswerRule {
  const fontRaw = formData.get("ruleFont");
  const sizeRaw = formData.get("ruleSize");
  const colorRaw = formData.get("ruleColorHex");

  const font =
    typeof fontRaw === "string" && fontRaw.trim() ? fontRaw.trim() : undefined;
  const size =
    typeof sizeRaw === "string" && sizeRaw.trim() ? sizeRaw.trim() : undefined;

  const bold = formData.get("ruleBold") ? true : undefined;
  const italic = formData.get("ruleItalic") ? true : undefined;

  return {
    font,
    bold,
    italic,
    sizeHalfPoints: toSizeHalfPoints(size),
    colorHex: normalizeHexColor(typeof colorRaw === "string" ? colorRaw : undefined),
  };
}
