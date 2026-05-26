import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Badge, Btn, Card } from "@/components/design/primitives";
import { Plus } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminBanksPage() {
  const banks = await prisma.questionBank.findMany({
    orderBy: { updatedAt: "desc" },
    include: { category: true, _count: { select: { questions: true } } },
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-[22px] font-semibold tracking-[-0.02em]">Ngân hàng câu hỏi</h1>
          <p className="mt-1 text-[13.5px] text-[var(--textMuted)]">
            Danh sách bộ câu hỏi đã trích xuất từ Word
          </p>
        </div>
        <Link href="/admin/convert">
          <Btn kind="primary" icon={<Plus className="h-4 w-4" />}>
            Tạo bộ câu hỏi
          </Btn>
        </Link>
      </div>

      <Card padding={0}>
        <div className="grid grid-cols-[1fr_auto_auto_auto] gap-4 border-b border-[var(--border)] px-5 py-3 text-[12px] font-medium text-[var(--textMuted)]">
          <span>Tên</span>
          <span className="hidden sm:block">Số câu</span>
          <span className="hidden md:block">Cập nhật</span>
          <span>Trạng thái</span>
        </div>
        {banks.map((b) => (
          <Link
            key={b.id}
            href={`/admin/banks/${b.id}`}
            className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-4 border-b border-[var(--border)] px-5 py-4 text-[13.5px] last:border-0 hover:bg-[var(--bgMuted)]"
          >
            <div>
              <div className="font-medium">{b.title}</div>
              <div className="mt-0.5 text-[12px] text-[var(--textMuted)]">{b.category.name}</div>
            </div>
            <span className="hidden text-[var(--textMuted)] sm:block">{b._count.questions}</span>
            <span className="hidden text-[var(--textMuted)] md:block">
              {b.updatedAt.toLocaleDateString("vi-VN")}
            </span>
            <Badge tone="primary">Đã tạo</Badge>
          </Link>
        ))}
        {!banks.length ? (
          <div className="px-5 py-12 text-center text-sm text-[var(--textMuted)]">
            Chưa có ngân hàng.{" "}
            <Link href="/admin/convert" className="text-[var(--p)] font-medium">
              Tạo bộ câu hỏi
            </Link>
          </div>
        ) : null}
      </Card>
    </div>
  );
}
