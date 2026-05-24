"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";

function parseQuestionIds(value: unknown): string[] {
  if (Array.isArray(value) && value.every((v) => typeof v === "string")) return value;
  return [];
}

export async function openVariant(formData: FormData) {
  const user = await requireUser();
  const variantId = String(formData.get("variantId") ?? "");
  if (!variantId) redirect("/quiz");

  const existing = await prisma.attempt.findFirst({
    where: { userId: user.id, variantId, finishedAt: null },
    orderBy: { startedAt: "desc" },
  });
  if (!existing) {
    await prisma.attempt.create({
      data: { userId: user.id, variantId, answers: {} },
    });
  }

  redirect(`/quiz/${variantId}`);
}

export async function answerCurrentQuestion(formData: FormData) {
  const user = await requireUser();

  const schema = z.object({
    attemptId: z.string().min(1),
    variantId: z.string().min(1),
    questionId: z.string().min(1),
    selected: z.enum(["A", "B", "C", "D"]),
  });

  const data = schema.parse({
    attemptId: formData.get("attemptId"),
    variantId: formData.get("variantId"),
    questionId: formData.get("questionId"),
    selected: formData.get("selected"),
  });

  const attempt = await prisma.attempt.findFirst({
    where: { id: data.attemptId, userId: user.id },
    include: { variant: { include: { exam: true } } },
  });
  if (!attempt) throw new Error("Attempt not found");

  const variantQuestionIds = parseQuestionIds(attempt.variant.questionIds);
  const currentIndex = attempt.currentIndex;
  const expectedQuestionId = variantQuestionIds[currentIndex];
  if (expectedQuestionId !== data.questionId) {
    redirect(`/quiz/${data.variantId}`);
  }

  const answers = (attempt.answers ?? {}) as Record<string, string>;
  answers[data.questionId] = data.selected;

  const nextIndex = currentIndex + 1;
  const isFinished = nextIndex >= variantQuestionIds.length;

  if (!isFinished) {
    await prisma.attempt.update({
      where: { id: attempt.id },
      data: { answers, currentIndex: nextIndex },
    });
    redirect(`/quiz/${data.variantId}`);
  }

  // Finish: score
  const questions = await prisma.question.findMany({
    where: { id: { in: variantQuestionIds } },
    select: { id: true, correctOption: true, isCritical: true },
  });

  const questionById: Map<
    string,
    { id: string; correctOption: string | null; isCritical: boolean }
  > = new Map(questions.map((q) => [q.id, q] as const));

  let correct = 0;
  let wrong = 0;
  let criticalWrong = false;

  for (const qid of variantQuestionIds) {
    const q = questionById.get(qid);
    const selected = answers[qid];
    const expected = q?.correctOption ?? null;
    const isRight = expected && selected === expected;
    if (isRight) correct += 1;
    else wrong += 1;
    if (q?.isCritical && !isRight) criticalWrong = true;
  }

  const maxWrongAllowed = attempt.variant.exam.maxWrongAllowed;
  const status = criticalWrong || wrong > maxWrongAllowed ? "FAILED" : "PASSED";

  await prisma.attempt.update({
    where: { id: attempt.id },
    data: {
      answers,
      currentIndex: variantQuestionIds.length,
      finishedAt: new Date(),
      score: correct,
      status,
    },
  });

  redirect("/quiz");
}

export async function retryVariant(formData: FormData) {
  const user = await requireUser();
  const variantId = String(formData.get("variantId") ?? "");
  if (!variantId) redirect("/quiz");
  await prisma.attempt.create({ data: { userId: user.id, variantId, answers: {} } });
  redirect(`/quiz/${variantId}`);
}
