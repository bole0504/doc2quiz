import Link from "next/link";
import { getLearnerCatalog } from "@/lib/services/quizService";
import { getCurrentUser } from "@/lib/auth";
import { Badge, Card } from "@/components/design/primitives";

export const dynamic = "force-dynamic";

export default async function QuizHome() {
  const user = await getCurrentUser();
  if (!user) return null;

  const catalog = await getLearnerCatalog(user.id);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-[22px] font-semibold tracking-[-0.02em]">Bộ đề thi</h1>
        <p className="mt-1 text-[13.5px] text-[var(--textMuted)]">
          Chọn ngân hàng câu hỏi để xem các bộ đề
        </p>
      </div>

      <div className="grid gap-3">
        {catalog.map((bank) => (
          <Card key={bank.id} padding={0}>
            <Link
              href={`/quiz/banks/${bank.id}`}
              className="block px-5 py-4 transition hover:bg-[var(--bgMuted)]"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="font-medium">{bank.title}</div>
                <Badge tone="default">{bank.questionCount} câu</Badge>
              </div>
              <div className="mt-1 text-[12px] text-[var(--textMuted)]">{bank.category}</div>
            </Link>
          </Card>
        ))}
        {!catalog.length ? (
          <Card padding={24} className="text-center text-[var(--textMuted)]">
            Chưa có ngân hàng. Nhờ admin tạo bộ câu hỏi.
          </Card>
        ) : null}
      </div>
    </div>
  );
}
