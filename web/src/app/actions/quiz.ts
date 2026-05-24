"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { finalizeAttempt } from "@/lib/quiz/finalizeAttempt";

function parseQuestionIds(value: unknown): string[] {
  if (Array.isArray(value) && value.every((v) => typeof v === "string")) return value;
  return [];
}

function isTimedOut(args: { startedAt: Date; timeLimitMinutes: number | null | undefined }) {
  const { startedAt, timeLimitMinutes } = args;
  if (!timeLimitMinutes) return false;
  const deadlineMs = startedAt.getTime() + timeLimitMinutes * 60 * 1000;
  return Date.now() >= deadlineMs;
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

  if (isTimedOut({ startedAt: attempt.startedAt, timeLimitMinutes: attempt.variant.exam.timeLimitMinutes })) {
    await finalizeAttempt({ attemptId: attempt.id });
    redirect("/quiz");
  }

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

  await prisma.attempt.update({
    where: { id: attempt.id },
    data: {
      answers,
      currentIndex: variantQuestionIds.length,
    },
  });

  await finalizeAttempt({ attemptId: attempt.id });
  redirect("/quiz");
}

export async function submitAttempt(formData: FormData) {
  const user = await requireUser();

  const schema = z.object({
    attemptId: z.string().min(1),
    variantId: z.string().min(1),
  });

  const data = schema.parse({
    attemptId: formData.get("attemptId"),
    variantId: formData.get("variantId"),
  });

  const attempt = await prisma.attempt.findFirst({
    where: { id: data.attemptId, userId: user.id, variantId: data.variantId, finishedAt: null },
  });
  if (!attempt) redirect("/quiz");

  await finalizeAttempt({ attemptId: attempt.id });
  redirect("/quiz");
}

export async function retryVariant(formData: FormData) {
  const user = await requireUser();
  const variantId = String(formData.get("variantId") ?? "");
  if (!variantId) redirect("/quiz");
  await prisma.attempt.create({ data: { userId: user.id, variantId, answers: {} } });
  redirect(`/quiz/${variantId}`);
}
