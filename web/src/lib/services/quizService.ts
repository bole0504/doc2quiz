import { prisma } from "@/lib/prisma";
import { finalizeAttempt } from "@/lib/quiz/finalizeAttempt";

function parseQuestionIds(value: unknown): string[] {
  if (Array.isArray(value) && value.every((v) => typeof v === "string")) return value;
  return [];
}

function isTimedOut(args: {
  startedAt: Date;
  timeLimitMinutes: number | null | undefined;
}) {
  const { startedAt, timeLimitMinutes } = args;
  if (!timeLimitMinutes) return false;
  const deadlineMs = startedAt.getTime() + timeLimitMinutes * 60 * 1000;
  return Date.now() >= deadlineMs;
}

export async function getLearnerCatalog(userId: string) {
  const banks = await prisma.questionBank.findMany({
    orderBy: { title: "asc" },
    include: {
      category: true,
      _count: { select: { questions: true } },
      exams: {
        include: {
          variants: {
            include: {
              attempts: {
                where: { userId },
                orderBy: { startedAt: "desc" },
                take: 1,
              },
            },
          },
        },
      },
    },
  });

  return banks.map((bank) => ({
    id: bank.id,
    title: bank.title,
    category: bank.category.name,
    questionCount: bank._count.questions,
    exams: bank.exams.map((exam) => ({
      id: exam.id,
      name: exam.name,
      questionsPerTest: exam.questionsPerTest,
      timeLimitMinutes: exam.timeLimitMinutes,
      maxWrongAllowed: exam.maxWrongAllowed,
      variants: exam.variants.map((v) => {
        const last = v.attempts[0];
        return {
          id: v.id,
          index: v.index,
          status: last?.status ?? null,
          score: last?.score ?? null,
          inProgress: last ? last.finishedAt === null : false,
        };
      }),
    })),
  }));
}

export async function getVariantForExam(variantId: string, userId: string) {
  const variant = await prisma.examVariant.findUnique({
    where: { id: variantId },
    include: { exam: { include: { bank: true } } },
  });
  if (!variant) throw new Error("NOT_FOUND");

  let attempt = await prisma.attempt.findFirst({
    where: { userId, variantId, finishedAt: null },
    orderBy: { startedAt: "desc" },
  });

  if (!attempt) {
    attempt = await prisma.attempt.create({
      data: { userId, variantId, answers: {} },
    });
  }

  if (
    isTimedOut({
      startedAt: attempt.startedAt,
      timeLimitMinutes: variant.exam.timeLimitMinutes,
    })
  ) {
    await finalizeAttempt({ attemptId: attempt.id });
    throw new Error("TIMED_OUT");
  }

  const questionIds = parseQuestionIds(variant.questionIds);
  const currentIndex = attempt.currentIndex;
  if (currentIndex >= questionIds.length) {
    return {
      variant: {
        id: variant.id,
        examName: variant.exam.name,
        timeLimitMinutes: variant.exam.timeLimitMinutes,
        totalQuestions: questionIds.length,
      },
      attempt: {
        id: attempt.id,
        status: attempt.status,
        finished: true,
      },
      question: null,
    };
  }

  const questionId = questionIds[currentIndex];
  const question = await prisma.question.findUnique({ where: { id: questionId } });
  if (!question) throw new Error("NOT_FOUND");

  const answers = (attempt.answers ?? {}) as Record<string, string>;

  return {
    variant: {
      id: variant.id,
      examName: variant.exam.name,
      timeLimitMinutes: variant.exam.timeLimitMinutes,
      totalQuestions: questionIds.length,
      deadlineMs: variant.exam.timeLimitMinutes
        ? attempt.startedAt.getTime() + variant.exam.timeLimitMinutes * 60 * 1000
        : null,
    },
    attempt: {
      id: attempt.id,
      currentIndex,
      status: attempt.status,
      finished: false,
    },
    question: {
      id: question.id,
      index: currentIndex,
      text: question.text,
      options: {
        A: question.optionA,
        B: question.optionB,
        C: question.optionC,
        D: question.optionD,
      },
      selected: answers[question.id] ?? null,
    },
  };
}

export async function openVariant(userId: string, variantId: string) {
  const existing = await prisma.attempt.findFirst({
    where: { userId, variantId, finishedAt: null },
    orderBy: { startedAt: "desc" },
  });
  if (!existing) {
    await prisma.attempt.create({
      data: { userId, variantId, answers: {} },
    });
  }
  return getVariantForExam(variantId, userId);
}

export async function answerQuestion(args: {
  userId: string;
  attemptId: string;
  variantId: string;
  questionId: string;
  selected: "A" | "B" | "C" | "D";
}) {
  const attempt = await prisma.attempt.findFirst({
    where: { id: args.attemptId, userId: args.userId, variantId: args.variantId },
    include: { variant: { include: { exam: true } } },
  });
  if (!attempt) throw new Error("NOT_FOUND");

  if (
    isTimedOut({
      startedAt: attempt.startedAt,
      timeLimitMinutes: attempt.variant.exam.timeLimitMinutes,
    })
  ) {
    await finalizeAttempt({ attemptId: attempt.id });
    throw new Error("TIMED_OUT");
  }

  const variantQuestionIds = parseQuestionIds(attempt.variant.questionIds);
  const expectedQuestionId = variantQuestionIds[attempt.currentIndex];
  if (expectedQuestionId !== args.questionId) {
    throw new Error("QUESTION_MISMATCH");
  }

  const answers = (attempt.answers ?? {}) as Record<string, string>;
  answers[args.questionId] = args.selected;

  const nextIndex = attempt.currentIndex + 1;
  const isFinished = nextIndex >= variantQuestionIds.length;

  if (!isFinished) {
    await prisma.attempt.update({
      where: { id: attempt.id },
      data: { answers, currentIndex: nextIndex },
    });
    return { finished: false, result: null };
  }

  await prisma.attempt.update({
    where: { id: attempt.id },
    data: { answers, currentIndex: variantQuestionIds.length },
  });
  await finalizeAttempt({ attemptId: attempt.id });

  const updated = await prisma.attempt.findUnique({ where: { id: attempt.id } });
  return {
    finished: true,
    result: {
      status: updated?.status ?? "FAILED",
      score: updated?.score ?? 0,
      total: variantQuestionIds.length,
    },
  };
}

export async function submitAttempt(userId: string, attemptId: string, variantId: string) {
  const attempt = await prisma.attempt.findFirst({
    where: {
      id: attemptId,
      userId,
      variantId,
      finishedAt: null,
    },
    include: { variant: { include: { exam: true } } },
  });
  if (!attempt) throw new Error("NOT_FOUND");

  await finalizeAttempt({ attemptId: attempt.id });
  const updated = await prisma.attempt.findUnique({ where: { id: attempt.id } });
  const total = parseQuestionIds(attempt.variant.questionIds).length;
  return {
    status: updated?.status ?? "FAILED",
    score: updated?.score ?? 0,
    total,
  };
}

export async function retryVariant(userId: string, variantId: string) {
  await prisma.attempt.create({
    data: { userId, variantId, answers: {} },
  });
  return getVariantForExam(variantId, userId);
}

export async function getAttemptResult(userId: string, attemptId: string) {
  const attempt = await prisma.attempt.findFirst({
    where: { id: attemptId, userId },
    include: { variant: { include: { exam: true } } },
  });
  if (!attempt || !attempt.finishedAt) throw new Error("NOT_FOUND");
  const total = parseQuestionIds(attempt.variant.questionIds).length;
  return {
    status: attempt.status,
    score: attempt.score ?? 0,
    total,
    examName: attempt.variant.exam.name,
    passed: attempt.status === "PASSED",
  };
}
