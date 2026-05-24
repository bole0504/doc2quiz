import Form from "next/form";
import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { answerCurrentQuestion } from "@/app/actions/quiz";

export const dynamic = "force-dynamic";

function parseQuestionIds(value: unknown): string[] {
  if (Array.isArray(value) && value.every((v) => typeof v === "string")) return value;
  return [];
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

  const questionIds = parseQuestionIds(variant.questionIds);
  const currentIndex = attempt.currentIndex;
  if (currentIndex >= questionIds.length) redirect("/quiz");

  const questionId = questionIds[currentIndex];
  const question = await prisma.question.findUnique({ where: { id: questionId } });
  if (!question) redirect("/quiz");

  const answers = (attempt.answers ?? {}) as Record<string, string>;
  const existing = answers[questionId] as "A" | "B" | "C" | "D" | undefined;

  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-sm text-zinc-600">{variant.exam.name}</div>
          <h1 className="text-xl font-semibold">Bộ {variant.index}</h1>
        </div>
        <div className="text-sm text-zinc-600">
          {currentIndex + 1}/{questionIds.length}
        </div>
      </div>

      <div className="rounded-xl border bg-white p-5">
        <div className="text-sm font-semibold">Câu {currentIndex + 1}</div>
        <div className="mt-2 text-sm text-zinc-900">{question.text}</div>

        <Form action={answerCurrentQuestion} className="mt-5 grid gap-2">
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
              className="flex cursor-pointer items-start gap-3 rounded-lg border px-3 py-2 hover:bg-zinc-50"
            >
              <input
                type="radio"
                name="selected"
                value={letter}
                required
                defaultChecked={existing === letter}
                className="mt-1"
              />
              <div className="text-sm">
                <span className="font-medium">{letter}.</span> {text}
              </div>
            </label>
          ))}

          <button className="mt-2 rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800">
            {currentIndex + 1 === questionIds.length ? "Nộp bài" : "Câu tiếp"}
          </button>
        </Form>
      </div>

      <div className="text-sm">
        <Link href="/quiz" className="text-zinc-900 underline">
          ← Quay lại danh sách
        </Link>
      </div>
    </div>
  );
}
