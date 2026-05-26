import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getAttemptResult } from "@/lib/services/quizService";
import { Btn, Card } from "@/components/design/primitives";
import { CheckCircle2, XCircle } from "lucide-react";
import Form from "next/form";
import { retryVariant } from "@/app/actions/quiz";

export const dynamic = "force-dynamic";

export default async function QuizResultPage({
  params,
  searchParams,
}: {
  params: { variantId?: string } | Promise<{ variantId?: string }>;
  searchParams?: { attemptId?: string } | Promise<{ attemptId?: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const { variantId } = await Promise.resolve(params);
  const { attemptId } = await Promise.resolve(searchParams ?? {});
  if (!variantId || !attemptId) redirect("/quiz");

  const result = await getAttemptResult(user.id, attemptId);
  const passed = result.passed;

  return (
    <div className="mx-auto flex max-w-md flex-col gap-6 py-8">
      <Card
        padding={32}
        className={`text-center ${
          passed ? "bg-[var(--successSoft)]" : "bg-[var(--dangerSoft)]"
        }`}
      >
        {passed ? (
          <CheckCircle2 className="mx-auto h-16 w-16 text-[var(--success)]" />
        ) : (
          <XCircle className="mx-auto h-16 w-16 text-[var(--danger)]" />
        )}
        <h1 className="mt-4 text-[24px] font-semibold">
          {passed ? "Đậu" : "Chưa đạt"}
        </h1>
        <p className="mt-2 text-[15px] text-[var(--textMuted)]">
          {result.score}/{result.total} câu đúng
        </p>
        <p className="text-[13px] text-[var(--textSubtle)]">{result.examName}</p>
      </Card>

      <div className="flex flex-col gap-2">
        <Link href="/quiz">
          <Btn kind="primary" fullWidth>
            Quay về
          </Btn>
        </Link>
        {!passed ? (
          <Form action={retryVariant}>
            <input type="hidden" name="variantId" value={variantId} />
            <Btn kind="secondary" fullWidth type="submit">
              Thi lại
            </Btn>
          </Form>
        ) : null}
      </div>
    </div>
  );
}
