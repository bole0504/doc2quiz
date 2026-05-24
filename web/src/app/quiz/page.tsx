import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default async function QuizHome() {
  const user = await getCurrentUser();
  if (!user) return null;

  const banks = await prisma.questionBank.findMany({
    orderBy: { createdAt: "desc" },
    include: { category: true, _count: { select: { questions: true, exams: true } } },
  });

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <div>
            <CardTitle className="text-xl">Thi thử</CardTitle>
            <CardDescription>
              Chọn 1 ngân hàng câu hỏi để xem các bộ đề đã được admin cấu hình.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="grid gap-2">
          {banks.map((b) => (
            <Link
              key={b.id}
              href={`/quiz/banks/${b.id}`}
              className="group rounded-xl border bg-white px-4 py-3 shadow-sm transition hover:-translate-y-0.5 hover:border-zinc-200 hover:shadow"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <div className="font-medium group-hover:text-zinc-950">{b.title}</div>
                <div className="text-xs text-zinc-500">
                  {b.category.name} • {b._count.questions} câu • {b._count.exams} bộ đề
                </div>
              </div>
              {b.sourceFile ? (
                <div className="mt-1 text-xs text-zinc-500">File: {b.sourceFile}</div>
              ) : null}
            </Link>
          ))}
          {!banks.length ? (
            <div className="text-sm text-zinc-600">
              Chưa có ngân hàng câu hỏi. Nhờ admin upload DOCX để tạo.
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
