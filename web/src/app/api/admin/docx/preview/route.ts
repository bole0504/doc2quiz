import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { parseQuizDocxStyled } from "@/lib/docx/parseQuizDocxStyled";
import { ruleFromFormData } from "@/lib/docx/correctRule";

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });
  }

  const formData = await req.formData();
  const file = formData.get("docx");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Missing file" }, { status: 400 });
  }

  const rule = ruleFromFormData(formData);
  const buffer = Buffer.from(await file.arrayBuffer());
  const parsed = parseQuizDocxStyled(buffer, rule);

  const preview = parsed.slice(0, 5).map((q) => ({
    ordinalFromDoc: q.ordinalFromDoc,
    text: q.text,
    correctOption: q.correctOption,
    options: {
      A: q.options.A.text,
      B: q.options.B.text,
      C: q.options.C.text,
      D: q.options.D.text,
    },
  }));

  const correctCount = parsed.filter((q) => q.correctOption).length;
  return NextResponse.json({
    totalQuestions: parsed.length,
    correctDetected: correctCount,
    preview,
  });
}

