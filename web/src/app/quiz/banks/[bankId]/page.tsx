import Form from "next/form";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { openVariant, retryVariant } from "@/app/actions/quiz";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const dynamic = "force-dynamic";

function parseQuestionIds(value: unknown): string[] {
  if (Array.isArray(value) && value.every((v) => typeof v === "string")) return value;
  return [];
}

export default async function QuizBankPage({
  params,
}: {
  params: { bankId?: string } | Promise<{ bankId?: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) return null;

  const { bankId } = await Promise.resolve(params);
  if (!bankId) return <div className="text-sm text-zinc-600">Thiếu bankId.</div>;

  const bank = await prisma.questionBank.findUnique({
    where: { id: bankId },
    include: { category: true, _count: { select: { questions: true } } },
  });
  if (!bank) return <div className="text-sm text-zinc-600">Không tìm thấy ngân hàng.</div>;

  const exams = await prisma.exam.findMany({
    where: { bankId },
    orderBy: { createdAt: "desc" },
    include: {
      category: true,
      variants: { orderBy: { index: "asc" } },
    },
  });

  const variantIds = exams.flatMap((e) => e.variants.map((v) => v.id));
  const attempts = variantIds.length
    ? await prisma.attempt.findMany({
        where: { userId: user.id, variantId: { in: variantIds } },
        orderBy: { startedAt: "desc" },
      })
    : [];

  const attemptByVariant = new Map<string, (typeof attempts)[number]>();
  for (const a of attempts) {
    if (!attemptByVariant.has(a.variantId)) attemptByVariant.set(a.variantId, a);
  }

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <div>
            <Link href="/quiz" className="text-sm text-zinc-600 underline">
              ← Quay lại ngân hàng
            </Link>
            <CardTitle className="mt-2 text-xl">{bank.title}</CardTitle>
            <CardDescription>
              {bank.category.name} • {bank._count.questions} câu • {exams.length} bộ đề
            </CardDescription>
          </div>
        </CardHeader>
      </Card>

      <div className="grid gap-4">
        {exams.map((exam) => (
          <Card key={exam.id}>
            <CardHeader>
              <div>
                <CardTitle>{exam.name}</CardTitle>
                <CardDescription>
                  {exam.category.name} • {exam.questionsPerTest} câu • sai tối đa{" "}
                  {exam.maxWrongAllowed}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {exam.variants.map((variant) => {
                const attempt = attemptByVariant.get(variant.id);
                const questionCount =
                  parseQuestionIds(variant.questionIds).length || exam.questionsPerTest;

                let badge = "Chưa thi";
                let badgeVariant: "neutral" | "warning" | "success" | "danger" = "neutral";

                if (attempt) {
                  if (!attempt.finishedAt) {
                    badge = `Đang thi ${attempt.currentIndex}/${questionCount}`;
                    badgeVariant = "warning";
                  } else if (attempt.status === "PASSED") {
                    badge = `Đậu ${attempt.score ?? 0}/${questionCount}`;
                    badgeVariant = "success";
                  } else {
                    badge = `Rớt ${attempt.score ?? 0}/${questionCount}`;
                    badgeVariant = "danger";
                  }
                }

                return (
                  <div key={variant.id} className="rounded-xl border bg-white p-4 shadow-sm">
                    <div className="flex items-center justify-between gap-2">
                      <div className="font-medium">Bộ {variant.index}</div>
                      <Badge variant={badgeVariant}>{badge}</Badge>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Form action={openVariant}>
                        <input type="hidden" name="variantId" value={variant.id} />
                        <Button size="sm" type="submit">
                          Thi thử
                        </Button>
                      </Form>
                      <Form action={retryVariant}>
                        <input type="hidden" name="variantId" value={variant.id} />
                        <Button size="sm" variant="outline" type="submit">
                          Thi lại
                        </Button>
                      </Form>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        ))}

        {!exams.length ? (
          <Card>
            <div className="text-sm text-zinc-600">
              Ngân hàng này chưa có bộ đề. Nhờ admin tạo bộ đề trong phần Admin.
            </div>
          </Card>
        ) : null}
      </div>
    </div>
  );
}
