import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Badge, Btn, Card } from "@/components/design/primitives";
import { BookOpen, FileText, Plus, Users } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [bankCount, questionCount, examCount, attemptCount] = await Promise.all([
    prisma.questionBank.count(),
    prisma.question.count(),
    prisma.exam.count(),
    prisma.attempt.count(),
  ]);

  const recentBanks = await prisma.questionBank.findMany({
    take: 5,
    orderBy: { updatedAt: "desc" },
    include: { _count: { select: { questions: true } } },
  });

  const kpis = [
    { label: "Bộ đề", value: bankCount, icon: BookOpen },
    { label: "Câu hỏi", value: questionCount, icon: FileText },
    { label: "Lượt thi", value: attemptCount, icon: Users },
    { label: "Bộ đề thi", value: examCount, icon: FileText },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-[22px] font-semibold tracking-[-0.02em]">Tổng quan</h1>
        <p className="mt-1 text-[13.5px] text-[var(--textMuted)]">
          Quản lý ngân hàng câu hỏi và bộ đề thi
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((k) => {
          const Icon = k.icon;
          return (
            <Card key={k.label} padding={20}>
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-[13px] text-[var(--textMuted)]">{k.label}</div>
                  <div className="mt-2 text-2xl font-semibold tracking-tight">{k.value}</div>
                </div>
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--pSoft)] text-[var(--p)]">
                  <Icon className="h-4 w-4" strokeWidth={1.75} />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card padding={20}>
          <div className="mb-4 flex items-center justify-between">
            <div className="text-[15px] font-semibold">Hoạt động gần đây</div>
            <Badge tone="default">Phase 2</Badge>
          </div>
          <ul className="flex flex-col gap-2">
            {recentBanks.map((b) => (
              <li key={b.id}>
                <Link
                  href={`/admin/banks/${b.id}`}
                  className="flex items-center justify-between rounded-[7px] px-2 py-2 text-[13.5px] hover:bg-[var(--bgSubtle)]"
                >
                  <span className="font-medium">{b.title}</span>
                  <span className="text-[var(--textMuted)]">{b._count.questions} câu</span>
                </Link>
              </li>
            ))}
            {!recentBanks.length ? (
              <li className="text-sm text-[var(--textMuted)]">Chưa có ngân hàng.</li>
            ) : null}
          </ul>
        </Card>

        <Card padding={24} className="flex flex-col justify-between bg-[var(--pSoft)] border-[var(--p)]/20">
          <div>
            <div className="text-[16px] font-semibold text-[var(--pSoftText)]">
              Tạo bộ câu hỏi mới
            </div>
            <p className="mt-2 text-[13px] text-[var(--pSoftText)]/80">
              Tải file Word và cấu hình quy tắc phát hiện đáp án đúng.
            </p>
          </div>
          <Link href="/admin/convert" className="mt-6">
            <Btn
              kind="primary"
              className="!bg-[var(--p)]"
              icon={<Plus className="h-4 w-4" />}
            >
              Bắt đầu chuyển đổi
            </Btn>
          </Link>
        </Card>
      </div>
    </div>
  );
}
