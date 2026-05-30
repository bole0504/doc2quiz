import Form from "next/form";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { deleteExam } from "@/app/actions/admin";
import { Badge, Btn, Card } from "@/components/design/primitives";
import { FileText, Plus, Trash2 } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminExamsPage() {
  const me = await requireUser();
  if (me.role !== "ADMIN") return <p>Không có quyền.</p>;

  const exams = await prisma.exam.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      bank: { select: { title: true } },
      category: { select: { name: true } },
      _count: { select: { variants: true } },
    },
  });

  // Total attempts per exam (Attempt has no direct exam relation — count via variants)
  const examIds = exams.map((e) => e.id);
  const attemptCounts = await prisma.attempt.groupBy({
    by: ["variantId"],
    where: { variant: { examId: { in: examIds } } },
    _count: { _all: true },
  });
  const variantToExam = new Map<string, string>();
  await prisma.examVariant
    .findMany({ where: { examId: { in: examIds } }, select: { id: true, examId: true } })
    .then((vs) => vs.forEach((v) => variantToExam.set(v.id, v.examId)));
  const attemptsByExam = new Map<string, number>();
  for (const row of attemptCounts) {
    const examId = variantToExam.get(row.variantId);
    if (!examId) continue;
    attemptsByExam.set(examId, (attemptsByExam.get(examId) ?? 0) + row._count._all);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[22px] font-semibold tracking-[-0.02em]">Bộ đề thi</h1>
          <p className="mt-1 text-[13.5px] text-[var(--textMuted)]">
            {exams.length} bộ đề
          </p>
        </div>
        <Link href="/admin/exams/new">
          <Btn kind="primary">
            <Plus className="mr-1 h-4 w-4" /> Tạo bộ đề
          </Btn>
        </Link>
      </div>

      {exams.length === 0 ? (
        <Card padding={0}>
          <div className="flex flex-col items-center gap-2 py-16 text-[var(--textMuted)]">
            <FileText className="h-10 w-10 opacity-30" strokeWidth={1.5} />
            <p className="text-[14px]">Chưa có bộ đề nào</p>
            <Link href="/admin/exams/new" className="mt-2 text-[13px] text-[var(--p)] hover:underline">
              Tạo bộ đề đầu tiên →
            </Link>
          </div>
        </Card>
      ) : (
        <Card padding={0}>
          <div className="grid grid-cols-[1fr_160px_80px_80px_110px_80px] gap-4 border-b border-[var(--border)] px-5 py-3 text-[12px] font-medium uppercase tracking-wide text-[var(--textSubtle)]">
            <span>Tên bộ đề</span>
            <span>Ngân hàng</span>
            <span>Mã đề</span>
            <span>Lượt thi</span>
            <span>Thời gian</span>
            <span className="text-right">Thao tác</span>
          </div>
          {exams.map((e) => (
            <div
              key={e.id}
              className="grid grid-cols-[1fr_160px_80px_80px_110px_80px] items-center gap-4 border-b border-[var(--border)] px-5 py-3 last:border-0"
            >
              <div className="min-w-0">
                <div className="truncate text-[13.5px] font-medium">{e.name}</div>
                <div className="text-[11.5px] text-[var(--textSubtle)]">
                  {e.category.name} • {e.questionsPerTest} câu • cho tối đa {e.maxWrongAllowed} sai
                </div>
              </div>
              <span className="truncate text-[13px] text-[var(--textMuted)]">{e.bank.title}</span>
              <span className="text-[13px] text-[var(--textMuted)]">{e._count.variants}</span>
              <span className="text-[13px] text-[var(--textMuted)]">{attemptsByExam.get(e.id) ?? 0}</span>
              <div>
                {e.timeLimitMinutes ? (
                  <Badge tone="default">{e.timeLimitMinutes} phút</Badge>
                ) : (
                  <Badge tone="default">Không giới hạn</Badge>
                )}
              </div>
              <div className="flex justify-end">
                <Form action={deleteExam}>
                  <input type="hidden" name="examId" value={e.id} />
                  <input type="hidden" name="returnTo" value="/admin/exams" />
                  <Btn kind="danger" size="sm" type="submit" title="Xoá bộ đề">
                    <Trash2 className="h-3.5 w-3.5" />
                  </Btn>
                </Form>
              </div>
            </div>
          ))}
        </Card>
      )}
    </div>
  );
}
