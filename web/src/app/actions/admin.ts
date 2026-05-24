"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { parseQuizDocx } from "@/lib/docx/parseQuizDocx";
import { parseQuizDocxStyled } from "@/lib/docx/parseQuizDocxStyled";

function shuffle<T>(arr: T[]) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export async function createCategory(formData: FormData) {
  const user = await requireUser();
  if (user.role !== "ADMIN") throw new Error("FORBIDDEN");

  const schema = z.object({
    name: z.string().min(1),
    slug: z.string().min(1).regex(/^[a-z0-9-]+$/),
  });
  const parsed = schema.parse({
    name: formData.get("name"),
    slug: formData.get("slug"),
  });

  try {
    await prisma.category.create({ data: parsed });
    redirect("/admin");
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "unknown";
    if (message.toLowerCase().includes("unique") || message.includes("P2002")) {
      redirect("/admin?error=category_slug_exists");
    }
    throw err;
  }
}

export async function createBankFromDocx(formData: FormData) {
  const user = await requireUser();
  if (user.role !== "ADMIN") throw new Error("FORBIDDEN");

  const schema = z.object({
    title: z.string().min(1),
    categoryId: z.string().min(1),
  });
  const parsed = schema.parse({
    title: formData.get("title"),
    categoryId: formData.get("categoryId"),
  });

  const file = formData.get("docx");
  if (!(file instanceof File)) throw new Error("Missing file");

  const arrayBuffer = await file.arrayBuffer();
  const styled = parseQuizDocxStyled(Buffer.from(arrayBuffer));
  const questions =
    styled.length > 0
      ? styled.map((q) => ({
          text: q.text,
          optionA: q.options.A.text,
          optionB: q.options.B.text,
          optionC: q.options.C.text,
          optionD: q.options.D.text,
          correctOption: q.correctOption,
          explanation: null,
        }))
      : await parseQuizDocx(Buffer.from(arrayBuffer));

  const bank = await prisma.questionBank.create({
    data: {
      title: parsed.title,
      categoryId: parsed.categoryId,
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

  redirect(`/admin/banks/${bank.id}`);
}

export async function applyAnswersFromDocxToBank(formData: FormData) {
  const user = await requireUser();
  if (user.role !== "ADMIN") throw new Error("FORBIDDEN");

  const bankId = String(formData.get("bankId") ?? "");
  if (!bankId) throw new Error("Missing bankId");

  const file = formData.get("docx");
  if (!(file instanceof File)) throw new Error("Missing file");

  const arrayBuffer = await file.arrayBuffer();
  const parsed = parseQuizDocxStyled(Buffer.from(arrayBuffer));

  if (!parsed.length) {
    throw new Error("Không nhận được đáp án theo style từ DOCX.");
  }

  const updates = parsed
    .filter((q) => q.correctOption)
    .map((q) =>
      prisma.question.updateMany({
        where: { bankId, ordinal: q.ordinalFromDoc },
        data: { correctOption: q.correctOption },
      })
    );

  await prisma.$transaction(updates);
  redirect(`/admin/banks/${bankId}`);
}

export async function updateQuestion(formData: FormData) {
  const user = await requireUser();
  if (user.role !== "ADMIN") throw new Error("FORBIDDEN");

  const schema = z.object({
    questionId: z.string().min(1),
    correctOption: z.enum(["A", "B", "C", "D"]).optional().nullable(),
    isCritical: z.enum(["on"]).optional().nullable(),
  });

  const rawCorrect = formData.get("correctOption");
  const parsed = schema.parse({
    questionId: formData.get("questionId"),
    correctOption: rawCorrect ? String(rawCorrect) : null,
    isCritical: formData.get("isCritical") ? "on" : null,
  });

  await prisma.question.update({
    where: { id: parsed.questionId },
    data: {
      correctOption: parsed.correctOption ?? null,
      isCritical: Boolean(parsed.isCritical),
    },
  });

  const returnTo = formData.get("returnTo");
  redirect(typeof returnTo === "string" && returnTo ? returnTo : "/admin");
}

export async function deleteQuestion(formData: FormData) {
  const user = await requireUser();
  if (user.role !== "ADMIN") throw new Error("FORBIDDEN");

  const questionId = String(formData.get("questionId") ?? "");
  if (!questionId) throw new Error("Missing questionId");

  await prisma.question.delete({ where: { id: questionId } });

  const returnTo = formData.get("returnTo");
  redirect(typeof returnTo === "string" && returnTo ? returnTo : "/admin");
}

export async function deleteBank(formData: FormData) {
  const user = await requireUser();
  if (user.role !== "ADMIN") throw new Error("FORBIDDEN");

  const bankId = String(formData.get("bankId") ?? "");
  if (!bankId) throw new Error("Missing bankId");

  await prisma.questionBank.delete({ where: { id: bankId } });
  redirect("/admin");
}

export async function createExam(formData: FormData) {
  const user = await requireUser();
  if (user.role !== "ADMIN") throw new Error("FORBIDDEN");

  const schema = z.object({
    name: z.string().min(1),
    bankId: z.string().min(1),
    questionsPerTest: z.coerce.number().int().min(1),
    maxWrongAllowed: z.coerce.number().int().min(0),
    variantCount: z.coerce.number().int().min(1).max(50),
    returnTo: z.string().optional().nullable(),
  });

  const data = schema.parse({
    name: formData.get("name"),
    bankId: formData.get("bankId"),
    questionsPerTest: formData.get("questionsPerTest"),
    maxWrongAllowed: formData.get("maxWrongAllowed"),
    variantCount: formData.get("variantCount"),
    returnTo: formData.get("returnTo"),
  });

  const bank = await prisma.questionBank.findUnique({
    where: { id: data.bankId },
    select: { id: true, categoryId: true },
  });
  if (!bank) throw new Error("Bank not found");

  const questions = await prisma.question.findMany({
    where: { bankId: data.bankId },
    select: { id: true },
    orderBy: { ordinal: "asc" },
  });

  if (questions.length < data.questionsPerTest) {
    throw new Error("Not enough questions in bank");
  }

  const exam = await prisma.exam.create({
    data: {
      name: data.name,
      categoryId: bank.categoryId,
      bankId: data.bankId,
      questionsPerTest: data.questionsPerTest,
      maxWrongAllowed: data.maxWrongAllowed,
      variantCount: data.variantCount,
    },
  });

  const questionIds = questions.map((q: { id: string }) => q.id);
  const variants = Array.from({ length: data.variantCount }, (_, i) => {
    const picked = shuffle([...questionIds]).slice(0, data.questionsPerTest);
    return { examId: exam.id, index: i + 1, questionIds: picked };
  });

  await prisma.examVariant.createMany({ data: variants });

  const safeReturnTo =
    typeof data.returnTo === "string" && data.returnTo.startsWith("/")
      ? data.returnTo
      : null;
  redirect(safeReturnTo ?? "/admin");
}
