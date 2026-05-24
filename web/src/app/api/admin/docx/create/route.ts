import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { parseQuizDocxStyled } from "@/lib/docx/parseQuizDocxStyled";
import { parseQuizDocx } from "@/lib/docx/parseQuizDocx";
import { ruleFromFormData } from "@/lib/docx/correctRule";

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });
  }

  const formData = await req.formData();
  const schema = z.object({
    bankTitle: z.string().min(1),
  });

  const parsedFields = schema.safeParse({
    bankTitle: formData.get("bankTitle"),
  });
  if (!parsedFields.success) {
    return NextResponse.json({ error: "Invalid fields" }, { status: 400 });
  }

  const file = formData.get("docx");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Missing file" }, { status: 400 });
  }

  const rule = ruleFromFormData(formData);
  const buffer = Buffer.from(await file.arrayBuffer());

  const styled = parseQuizDocxStyled(buffer, rule);
  const questions =
    styled.length > 0
      ? styled.map((q) => ({
          text: q.text,
          optionA: q.options.A.text,
          optionB: q.options.B.text,
          optionC: q.options.C.text,
          optionD: q.options.D.text,
          correctOption: q.correctOption,
          explanation: null as string | null,
        }))
      : await parseQuizDocx(buffer);

  const category = await prisma.category.upsert({
    where: { slug: "general" },
    update: {},
    create: { slug: "general", name: "General" },
  });

  const bank = await prisma.questionBank.create({
    data: {
      title: parsedFields.data.bankTitle,
      categoryId: category.id,
      sourceFile: file.name,
      questions: {
        createMany: {
          data: questions.map((q, idx) => ({
            ordinal: idx + 1,
            text: q.text,
            optionA: q.optionA,
            optionB: q.optionB,
            optionC: q.optionC,
            optionD: q.optionD,
            correctOption: q.correctOption ?? undefined,
            explanation: q.explanation ?? undefined,
          })),
        },
      },
    },
  });

  return NextResponse.json({ bankId: bank.id });
}
