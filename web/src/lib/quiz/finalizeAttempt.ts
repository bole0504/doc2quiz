import { prisma } from "@/lib/prisma";

function parseQuestionIds(value: unknown): string[] {
  if (Array.isArray(value) && value.every((v) => typeof v === "string")) return value;
  return [];
}

export async function finalizeAttempt(args: { attemptId: string }) {
  const attempt = await prisma.attempt.findUnique({
    where: { id: args.attemptId },
    include: { variant: { include: { exam: true } } },
  });
  if (!attempt) throw new Error("Attempt not found");
  if (attempt.finishedAt) return;

  const variantQuestionIds = parseQuestionIds(attempt.variant.questionIds);
  const answers = (attempt.answers ?? {}) as Record<string, string>;

  // Score
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
      currentIndex: variantQuestionIds.length,
      finishedAt: new Date(),
      score: correct,
      status,
    },
  });
}

