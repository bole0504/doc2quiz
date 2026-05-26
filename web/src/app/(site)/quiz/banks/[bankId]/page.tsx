import Form from "next/form";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { getLearnerCatalog } from "@/lib/services/quizService";
import {
  openVariant,
  retryVariant,
} from "@/app/actions/quiz";
import { Badge, Btn, Card } from "@/components/design/primitives";

export const dynamic = "force-dynamic";

export default async function QuizBankPage({
  params,
}: {
  params: { bankId?: string } | Promise<{ bankId?: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) return null;

  const { bankId } = await Promise.resolve(params);
  if (!bankId) return <div className="text-sm text-[var(--textMuted)]">Thiếu bankId.</div>;

  const catalog = await getLearnerCatalog(user.id);
  const bank = catalog.find((b) => b.id === bankId);
  if (!bank) return <div className="text-sm text-[var(--textMuted)]">Không tìm thấy.</div>;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link href="/quiz" className="text-[13px] text-[var(--p)] hover:underline">
          ← Quay lại
        </Link>
        <h1 className="mt-2 text-[22px] font-semibold tracking-[-0.02em]">{bank.title}</h1>
        <p className="text-[13px] text-[var(--textMuted)]">
          {bank.category} • {bank.questionCount} câu
        </p>
      </div>

      {bank.exams.map((exam) => (
        <Card key={exam.id} padding={20}>
          <h2 className="font-semibold">{exam.name}</h2>
          <p className="mt-1 text-[12px] text-[var(--textMuted)]">
            {exam.questionsPerTest} câu / lần thi
            {exam.timeLimitMinutes ? ` • ${exam.timeLimitMinutes} phút` : ""}
          </p>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {exam.variants.map((v) => {
              let tone: "default" | "warning" | "success" | "danger" = "default";
              let label = "Chưa thi";
              if (v.inProgress) {
                tone = "warning";
                label = "Đang thi";
              } else if (v.status === "PASSED") {
                tone = "success";
                label = `Đậu ${v.score ?? 0}`;
              } else if (v.status === "FAILED") {
                tone = "danger";
                label = `Rớt ${v.score ?? 0}`;
              }
              return (
                <div
                  key={v.id}
                  className="rounded-[10px] border border-[var(--border)] p-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Bộ {v.index}</span>
                    <Badge tone={tone}>{label}</Badge>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <Form action={openVariant}>
                      <input type="hidden" name="variantId" value={v.id} />
                      <Btn kind="primary" size="sm" type="submit">
                        Thi thử
                      </Btn>
                    </Form>
                    <Form action={retryVariant}>
                      <input type="hidden" name="variantId" value={v.id} />
                      <Btn kind="secondary" size="sm" type="submit">
                        Thi lại
                      </Btn>
                    </Form>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      ))}
      {!bank.exams.length ? (
        <Card padding={20} className="text-[var(--textMuted)]">
          Chưa có bộ đề. Nhờ admin tạo trong Admin.
        </Card>
      ) : null}
    </div>
  );
}
