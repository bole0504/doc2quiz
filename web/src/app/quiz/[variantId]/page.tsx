import Form from "next/form";
import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { answerCurrentQuestion } from "@/app/actions/quiz";
import { Button } from "@/components/ui/button";
import { finalizeAttempt } from "@/lib/quiz/finalizeAttempt";
import { QuizTimer } from "./_components/QuizTimer";

export const dynamic = "force-dynamic";

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

export default async function VariantPage({
  params,
}: {
  params: { variantId?: string } | Promise<{ variantId?: string }>;
}) {
  const user = await requireUser();
  const { variantId } = await Promise.resolve(params);
  if (!variantId) redirect("/quiz");

  const variant = await prisma.examVariant.findUnique({
    where: { id: variantId },
    include: { exam: true },
  });
  if (!variant) redirect("/quiz");

  const attempt = await prisma.attempt.findFirst({
    where: { userId: user.id, variantId, finishedAt: null },
    orderBy: { startedAt: "desc" },
  });
  if (!attempt) redirect("/quiz");

  if (isTimedOut({ startedAt: attempt.startedAt, timeLimitMinutes: variant.exam.timeLimitMinutes })) {
    await finalizeAttempt({ attemptId: attempt.id });
    redirect("/quiz");
  }

  const questionIds = parseQuestionIds(variant.questionIds);
  const currentIndex = attempt.currentIndex;
  if (currentIndex >= questionIds.length) redirect("/quiz");

  const questionId = questionIds[currentIndex];
  const question = await prisma.question.findUnique({ where: { id: questionId } });
  if (!question) redirect("/quiz");

  const answers = (attempt.answers ?? {}) as Record<string, string>;
  const existing = answers[questionId] as "A" | "B" | "C" | "D" | undefined;

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-[#E07F55] px-4 py-5 sm:px-8">
      <div className="mx-auto flex w-full max-w-xl items-center justify-between gap-3 text-white">
        <div className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-full bg-white/15 text-sm font-semibold">
            Q
          </div>
          <div className="font-semibold tracking-tight">{variant.exam.name}</div>
        </div>
        {variant.exam.timeLimitMinutes ? (
          <QuizTimer
            attemptId={attempt.id}
            variantId={variantId}
            deadlineMs={attempt.startedAt.getTime() + variant.exam.timeLimitMinutes * 60 * 1000}
          />
        ) : null}
        <Link
          href="/quiz"
          className="grid h-10 w-10 place-items-center rounded-full bg-white/15 text-xl leading-none hover:bg-white/20"
          aria-label="Close"
        >
          ×
        </Link>
      </div>

      <div className="mx-auto mt-6 w-full max-w-xl rounded-[28px] bg-white p-6 shadow-2xl sm:p-7">
        <div className="text-sm text-zinc-500">
          Question {currentIndex + 1} of {questionIds.length}
        </div>
        <div className="mt-4 text-[28px] font-semibold leading-tight text-zinc-950">
          {question.text}
        </div>

        <Form action={answerCurrentQuestion} className="mt-6 grid gap-3">
          <input type="hidden" name="attemptId" value={attempt.id} />
          <input type="hidden" name="variantId" value={variantId} />
          <input type="hidden" name="questionId" value={question.id} />

          {(
            [
              ["A", question.optionA],
              ["B", question.optionB],
              ["C", question.optionC],
              ["D", question.optionD],
            ] as const
          ).map(([letter, text]) => (
            <label
              key={letter}
              className="group flex cursor-pointer items-center gap-4 rounded-2xl border bg-zinc-50 px-4 py-4 transition hover:bg-zinc-100"
            >
              <input
                type="radio"
                name="selected"
                value={letter}
                required
                defaultChecked={existing === letter}
                className="peer sr-only"
              />
              <span className="grid h-7 w-7 place-items-center rounded-full border-2 border-zinc-300 bg-white transition peer-checked:border-blue-600 peer-checked:ring-4 peer-checked:ring-blue-100">
                <span className="h-3 w-3 rounded-full bg-blue-600 opacity-0 transition peer-checked:opacity-100" />
              </span>
              <div className="text-lg font-medium text-zinc-950">{text}</div>
            </label>
          ))}

          <Button
            type="submit"
            className="mt-3 h-14 w-full rounded-[999px] bg-white text-zinc-950 hover:bg-white/90"
          >
            {currentIndex + 1 === questionIds.length ? "Nộp bài" : "Next"}
          </Button>
        </Form>
      </div>
    </div>
  );
}
