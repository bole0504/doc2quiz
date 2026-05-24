import Link from "next/link";
import { prisma } from "@/lib/prisma";
import BankConfigModal from "@/app/admin/_components/BankConfigModal";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default async function AdminHome({
  searchParams,
}: {
  searchParams?: { error?: string } | Promise<{ error?: string }>;
}) {
  await Promise.resolve(searchParams ?? {});
  const banks = await prisma.questionBank.findMany({
    orderBy: { createdAt: "desc" },
    include: { category: true, _count: { select: { questions: true } } },
  });

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <div>
            <CardTitle>Ngân hàng câu hỏi</CardTitle>
            <CardDescription>Click vào 1 ngân hàng để xem câu hỏi và tạo bộ đề.</CardDescription>
          </div>
          <BankConfigModal />
        </CardHeader>
        <CardContent className="grid gap-2">
          {banks.map((b) => (
            <Link
              key={b.id}
              href={`/admin/banks/${b.id}`}
              className="group rounded-xl border bg-white px-4 py-3 shadow-sm transition hover:-translate-y-0.5 hover:border-zinc-200 hover:shadow"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <div className="font-medium group-hover:text-zinc-950">{b.title}</div>
                <div className="text-xs text-zinc-500">
                  {b.category.name} • {b._count.questions} câu
                </div>
              </div>
              {b.sourceFile ? (
                <div className="mt-1 text-xs text-zinc-500">File: {b.sourceFile}</div>
              ) : null}
            </Link>
          ))}
          {!banks.length ? <div className="text-sm text-zinc-500">Chưa có ngân hàng.</div> : null}
        </CardContent>
      </Card>
    </div>
  );
}
