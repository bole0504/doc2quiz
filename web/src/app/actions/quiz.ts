"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { requireUser } from "@/lib/auth";
import {
  answerQuestion,
  openVariant,
  retryVariant,
  submitAttempt,
} from "@/lib/services/quizService";

export async function openVariantAction(formData: FormData) {
  const user = await requireUser();
  const variantId = String(formData.get("variantId") ?? "");
  if (!variantId) redirect("/quiz");
  await openVariant(user.id, variantId);
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

  try {
    const result = await answerQuestion({
      userId: user.id,
      attemptId: data.attemptId,
      variantId: data.variantId,
      questionId: data.questionId,
      selected: data.selected,
    });
    if (result.finished) {
      redirect(`/quiz/${data.variantId}/result?attemptId=${data.attemptId}`);
    }
    redirect(`/quiz/${data.variantId}`);
  } catch (e) {
    if (e instanceof Error && e.message === "TIMED_OUT") redirect("/quiz");
    throw e;
  }
}

export async function submitAttemptAction(formData: FormData) {
  const user = await requireUser();

  const schema = z.object({
    attemptId: z.string().min(1),
    variantId: z.string().min(1),
  });

  const data = schema.parse({
    attemptId: formData.get("attemptId"),
    variantId: formData.get("variantId"),
  });

  await submitAttempt(user.id, data.attemptId, data.variantId);
  redirect(`/quiz/${data.variantId}/result?attemptId=${data.attemptId}`);
}

export async function retryVariantAction(formData: FormData) {
  const user = await requireUser();
  const variantId = String(formData.get("variantId") ?? "");
  if (!variantId) redirect("/quiz");
  await retryVariant(user.id, variantId);
  redirect(`/quiz/${variantId}`);
}

// Legacy exports for existing imports
export { openVariantAction as openVariant };
export { submitAttemptAction as submitAttempt };
export { retryVariantAction as retryVariant };
