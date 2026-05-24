import AdmZip from "adm-zip";
import { XMLParser } from "fast-xml-parser";

export type ParsedQuestion = {
  ordinalFromDoc: number;
  text: string;
  options: Record<"A" | "B" | "C" | "D", { text: string; isCorrect: boolean }>;
  correctOption: "A" | "B" | "C" | "D" | null;
};

export type CorrectAnswerRule = {
  font?: string; // exact match
  bold?: boolean;
  italic?: boolean;
  sizeHalfPoints?: string; // e.g. "27" for 13.5pt
  colorHex?: string; // e.g. "28A745"
};

const QUESTION_RE = /^Câu\s+(\d+)\s*:\s*(.*)$/i;
const OPTION_RE = /^([A-D])\s*[:.]\s*(.*)$/;

function normalizeWhitespace(text: string) {
  return text.replace(/\s+/g, " ").trim();
}

type RunStyle = {
  font?: string;
  bold?: boolean;
  italic?: boolean;
  size?: string; // half-points, e.g. "27" for 13.5pt
  color?: string;
};

function asArray<T>(value: T | T[] | undefined): T[] {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function getTextFromRun(run: Record<string, unknown>): string {
  // w:t can be string or object (with '#text')
  const ts = asArray(run["w:t"] as unknown);
  return ts
    .map((t) => {
      if (typeof t === "string") return t;
      if (t && typeof t === "object") {
        const obj = t as Record<string, unknown>;
        return String(obj["#text"] ?? "");
      }
      return "";
    })
    .join("");
}

function getRunStyle(run: Record<string, unknown>): RunStyle {
  const rPr = run["w:rPr"] as Record<string, unknown> | undefined;
  if (!rPr) return {};

  const fonts = rPr["w:rFonts"] as Record<string, unknown> | undefined;
  const rawFont =
    fonts &&
    (fonts["@_w:ascii"] ??
      fonts["@_w:hAnsi"] ??
      fonts["@_ascii"] ??
      fonts["@_hAnsi"]);
  const font = typeof rawFont === "string" ? rawFont : undefined;

  const bEl = (rPr["w:b"] ?? rPr["w:bCs"]) as Record<string, unknown> | undefined;
  const iEl = (rPr["w:i"] ?? rPr["w:iCs"]) as Record<string, unknown> | undefined;

  const bVal = bEl && (bEl["@_w:val"] ?? bEl["@_val"]);
  const iVal = iEl && (iEl["@_w:val"] ?? iEl["@_val"]);

  const bold = bEl ? !(bVal === "0" || bVal === 0) : undefined;
  const italic = iEl ? !(iVal === "0" || iVal === 0) : undefined;

  const sz = rPr["w:sz"] as Record<string, unknown> | undefined;
  const rawSize = sz && (sz["@_w:val"] ?? sz["@_val"]);
  const size = typeof rawSize === "string" ? rawSize : undefined;

  const color = rPr["w:color"] as Record<string, unknown> | undefined;
  const rawColor = color && (color["@_w:val"] ?? color["@_val"]);
  const colorVal = typeof rawColor === "string" ? rawColor : undefined;

  return { font, bold, italic, size, color: colorVal };
}

function matchesRule(style: RunStyle, rule: CorrectAnswerRule) {
  if (rule.font) {
    const a = style.font?.toLowerCase();
    const b = rule.font.toLowerCase();
    // Some DOCX files don't specify font at run-level; in that case, don't fail the match.
    if (a && a !== b) return false;
  }
  if (typeof rule.bold === "boolean") {
    if (style.bold === undefined || style.bold !== rule.bold) return false;
  }
  if (typeof rule.italic === "boolean") {
    if (style.italic === undefined || style.italic !== rule.italic) return false;
  }
  if (rule.sizeHalfPoints) {
    // Some DOCX files omit size at run-level; only enforce when present.
    if (style.size && style.size !== rule.sizeHalfPoints) return false;
  }
  if (rule.colorHex) {
    const c = style.color?.toUpperCase();
    // Some DOCX files omit color at run-level; only enforce when present.
    if (c && c !== rule.colorHex.toUpperCase()) return false;
  }
  return true;
}

export function parseQuizDocxStyled(
  buffer: Buffer,
  rule: CorrectAnswerRule = { font: "Arial", bold: true, italic: true, sizeHalfPoints: "27" }
): ParsedQuestion[] {
  const zip = new AdmZip(buffer);
  const entry = zip.getEntry("word/document.xml");
  if (!entry) throw new Error("DOCX missing word/document.xml");
  const xml = entry.getData().toString("utf8");

  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "@_",
    textNodeName: "#text",
    removeNSPrefix: false,
  });

  const doc = parser.parse(xml);
  const body = doc?.["w:document"]?.["w:body"];
  const paragraphs = asArray(body?.["w:p"]);

  const out: ParsedQuestion[] = [];
  let current: ParsedQuestion | null = null;
  let lastOption: "A" | "B" | "C" | "D" | null = null;

  const finalize = () => {
    if (!current) return;
    const correct = (["A", "B", "C", "D"] as const).find(
      (k) => current!.options[k].isCorrect
    );
    current.correctOption = correct ?? null;
    current.text = normalizeWhitespace(current.text);
    for (const k of ["A", "B", "C", "D"] as const) {
      current.options[k].text = normalizeWhitespace(current.options[k].text);
    }
    out.push(current);
    current = null;
    lastOption = null;
  };

  for (const p of paragraphs) {
    const runs = asArray(p?.["w:r"] as unknown);
    const segments = runs
      .map((r) => {
        const run = r as Record<string, unknown>;
        return { text: getTextFromRun(run), style: getRunStyle(run) };
      })
      .filter((s) => s.text);
    const text = normalizeWhitespace(segments.map((s) => s.text).join(""));
    if (!text) continue;

    const qm = QUESTION_RE.exec(text);
    if (qm) {
      finalize();
      const ordinalFromDoc = Number(qm[1]);
      current = {
        ordinalFromDoc,
        text: qm[2] ?? "",
        options: {
          A: { text: "", isCorrect: false },
          B: { text: "", isCorrect: false },
          C: { text: "", isCorrect: false },
          D: { text: "", isCorrect: false },
        },
        correctOption: null,
      };
      continue;
    }

    if (!current) continue;

    const om = OPTION_RE.exec(text);
    if (om) {
      const letter = om[1] as "A" | "B" | "C" | "D";
      // detect correct style in any run within this paragraph
      const correctInParagraph = segments.some((s) => matchesRule(s.style, rule));
      current.options[letter].text = om[2] ?? "";
      current.options[letter].isCorrect = correctInParagraph;
      lastOption = letter;
      continue;
    }

    // continuation paragraph: append to last option or question text
    const correctInParagraph = segments.some((s) => matchesRule(s.style, rule));
    if (lastOption) {
      current.options[lastOption].text += ` ${text}`;
      if (correctInParagraph) current.options[lastOption].isCorrect = true;
    } else {
      current.text += ` ${text}`;
    }
  }

  finalize();
  return out.filter(
    (q) =>
      q.text &&
      q.options.A.text &&
      q.options.B.text &&
      q.options.C.text &&
      q.options.D.text
  );
}
