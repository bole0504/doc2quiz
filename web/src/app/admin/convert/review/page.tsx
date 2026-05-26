import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Badge, Btn, Card } from "@/components/design/primitives";
import { ArrowRight, Check } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ConvertReviewPage({
  searchParams,
}: {
  searchParams?: { bankId?: string } | Promise<{ bankId?: string }>;
}) {
  const { bankId } = await Promise.resolve(searchParams ?? {});
  if (!bankId) redirect("/admin/convert");

  const bank = await prisma.questionBank.findUnique({
    where: { id: bankId },
    include: {
      questions: { orderBy: { ordinal: "asc" }, take: 20 },
      _count: { select: { questions: true } },
    },
  });
  if (!bank) redirect("/admin/convert");

  return (
    <div className="mx-auto flex max-w-[1100px] flex-col gap-4">
      <div>
        <h1 className="text-[22px] font-semibold tracking-[-0.02em]">Xem lại & tạo bộ đề</h1>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`flex h-[22px] w-[22px] items-center justify-center rounded-full text-xs font-semibold ${
                  s <= 3 ? "bg-[var(--p)] text-white" : "bg-[var(--bgSubtle)]"
                }`}
              >
                {s < 3 ? <Check className="h-3 w-3" /> : s}
              </div>
              <span className="text-[13px] font-semibold">
                {s === 1 ? "Cấu hình" : s === 2 ? "Trích xuất" : "Tạo bộ đề"}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <Card padding={0}>
          <div className="border-b border-[var(--border)] px-5 py-3">
            <div className="font-semibold">{bank.title}</div>
            <div className="text-[12px] text-[var(--textMuted)]">
              {bank._count.questions} câu hỏi
            </div>
          </div>
          <div className="max-h-[480px] overflow-y-auto">
            {bank.questions.map((q) => (
              <div
                key={q.id}
                className="border-b border-[var(--border)] px-5 py-3 text-[13px] last:border-0"
              >
                <div className="flex items-center gap-2">
                  <span className="font-medium">#{q.ordinal}</span>
                  {q.correctOption ? (
                    <Badge tone="primary">{q.correctOption}</Badge>
                  ) : (
                    <Badge tone="warning">Chưa set</Badge>
                  )}
                </div>
                <p className="mt-1 text-[var(--textMuted)] line-clamp-2">{q.text}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card padding={24}>
          <h2 className="text-[15px] font-semibold">Tiếp theo</h2>
          <p className="mt-2 text-[13px] text-[var(--textMuted)]">
            Chỉnh đáp án, điểm liệt và tạo bộ đề thi từ ngân hàng này.
          </p>
          <Link href={`/admin/banks/${bank.id}`} className="mt-6 block">
            <Btn kind="primary" fullWidth iconRight={<ArrowRight className="h-4 w-4" />}>
              Mở ngân hàng
            </Btn>
          </Link>
          <Link href="/admin/banks" className="mt-2 block">
            <Btn kind="secondary" fullWidth>
              Về danh sách
            </Btn>
          </Link>
        </Card>
      </div>
    </div>
  );
}
