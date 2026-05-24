import mammoth from "mammoth";

export type ParsedQuestion = {
  ordinal: number;
  text: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctOption: "A" | "B" | "C" | "D" | null;
  explanation: string | null;
};

const QUESTION_RE = /^Câu\s+(\d+)\s*:\s*(.*)$/i;
const OPTION_RE = /^([A-D])\s*[:.]\s*(.*)$/;
const ANSWER_RE = /Đáp\s*án\s*[: ]\s*([A-D])/i;

function normalizeWhitespace(text: string) {
  return text.replace(/\s+/g, " ").trim();
}

export async function parseQuizDocx(buffer: Buffer): Promise<ParsedQuestion[]> {
  const { value } = await mammoth.extractRawText({ buffer });
  const lines = value
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  const out: ParsedQuestion[] = [];
  let current:
    | (Omit<ParsedQuestion, "ordinal"> & {
        ordinalFromDoc?: number;
        _lastOption?: "A" | "B" | "C" | "D";
      })
    | null = null;

  function pushCurrent() {
    if (!current) return;
    out.push({
      ordinal: out.length + 1,
      text: normalizeWhitespace(current.text),
      optionA: normalizeWhitespace(current.optionA),
      optionB: normalizeWhitespace(current.optionB),
      optionC: normalizeWhitespace(current.optionC),
      optionD: normalizeWhitespace(current.optionD),
      correctOption: current.correctOption ?? null,
      explanation: current.explanation ? normalizeWhitespace(current.explanation) : null,
    });
    current = null;
  }

  for (const rawLine of lines) {
    const q = QUESTION_RE.exec(rawLine);
    if (q) {
      pushCurrent();
      current = {
        text: q[2] ?? "",
        optionA: "",
        optionB: "",
        optionC: "",
        optionD: "",
        correctOption: null,
        explanation: null,
        ordinalFromDoc: Number(q[1]),
      };
      continue;
    }

    if (!current) continue;

    const opt = OPTION_RE.exec(rawLine);
    if (opt) {
      const letter = opt[1] as "A" | "B" | "C" | "D";
      let body = opt[2] ?? "";

      const answerMatch = ANSWER_RE.exec(body);
      if (answerMatch && !current.correctOption) {
        current.correctOption = answerMatch[1].toUpperCase() as "A" | "B" | "C" | "D";
        const idx = body.search(ANSWER_RE);
        if (idx >= 0) {
          const before = body.slice(0, idx).trim();
          const after = body.slice(idx).trim();
          body = before;
          current.explanation = current.explanation ? `${current.explanation} ${after}` : after;
        }
      }

      current._lastOption = letter;
      if (letter === "A") current.optionA = body;
      if (letter === "B") current.optionB = body;
      if (letter === "C") current.optionC = body;
      if (letter === "D") current.optionD = body;
      continue;
    }

    // Continuation line
    if (current._lastOption) {
      if (current._lastOption === "A") current.optionA += ` ${rawLine}`;
      if (current._lastOption === "B") current.optionB += ` ${rawLine}`;
      if (current._lastOption === "C") current.optionC += ` ${rawLine}`;
      if (current._lastOption === "D") current.optionD += ` ${rawLine}`;
    } else {
      current.text += ` ${rawLine}`;
    }
  }

  pushCurrent();
  return out.filter(
    (q) => q.text && q.optionA && q.optionB && q.optionC && q.optionD
  );
}

