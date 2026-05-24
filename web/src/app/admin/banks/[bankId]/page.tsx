import Form from "next/form";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import {
  deleteBank,
  deleteQuestion,
  createExam,
  updateQuestion,
} from "@/app/actions/admin";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";

export const dynamic = "force-dynamic";

export default async function BankDetailPage({
  params,
  searchParams,
}: {
  params: { bankId?: string } | Promise<{ bankId?: string }>;
  searchParams?: { page?: string } | Promise<{ page?: string }>;
}) {
  const { bankId } = await Promise.resolve(params);
  if (!bankId) {
    return <div className="text-sm text-zinc-600">Thiếu bankId.</div>;
  }

  const { page } = await Promise.resolve(searchParams ?? {});
  const pageSize = 25;
  const requestedPage = Math.max(1, Number(page ?? "1") || 1);
  const bank = await prisma.questionBank.findUnique({
    where: { id: bankId },
    include: { category: true },
  });

  if (!bank) {
    return <div className="text-sm text-zinc-600">Không tìm thấy ngân hàng.</div>;
  }

  const total = await prisma.question.count({ where: { bankId } });
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(requestedPage, pageCount);
  const skip = (currentPage - 1) * pageSize;

  const questions = await prisma.question.findMany({
    where: { bankId },
    orderBy: { ordinal: "asc" },
    skip,
    take: pageSize,
  });

  const exams = await prisma.exam.findMany({
    where: { bankId },
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { variants: true } } },
  });

  return (
    <div className="grid gap-4">
      <Card>
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <div>
            <div className="text-base font-semibold">{bank.title}</div>
            <div className="mt-1 text-sm text-zinc-600">
              {bank.category.name} • {total} câu • trang {currentPage}/{pageCount}
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/admin"
              className="rounded-md border bg-white px-3 py-1.5 text-sm font-medium shadow-sm hover:bg-zinc-50"
            >
              ← Về Admin
            </Link>
            <Form action={deleteBank}>
              <input type="hidden" name="bankId" value={bankId} />
              <Button variant="destructive" size="sm">
                Xoá ngân hàng
              </Button>
            </Form>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm">
          <div className="text-zinc-600">
            Đang xem câu {skip + 1}–{Math.min(skip + pageSize, total)}
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href={`/admin/banks/${bankId}?page=1`}
              className="rounded-md border px-3 py-1.5 hover:bg-zinc-50"
            >
              Đầu
            </Link>
            <Link
              href={`/admin/banks/${bankId}?page=${Math.max(1, currentPage - 1)}`}
              className={`rounded-md border px-3 py-1.5 hover:bg-zinc-50 ${
                currentPage === 1 ? "pointer-events-none opacity-50" : ""
              }`}
            >
              Trước
            </Link>
            <Link
              href={`/admin/banks/${bankId}?page=${Math.min(pageCount, currentPage + 1)}`}
              className={`rounded-md border px-3 py-1.5 hover:bg-zinc-50 ${
                currentPage === pageCount ? "pointer-events-none opacity-50" : ""
              }`}
            >
              Sau
            </Link>
            <Link
              href={`/admin/banks/${bankId}?page=${pageCount}`}
              className="rounded-md border px-3 py-1.5 hover:bg-zinc-50"
            >
              Cuối
            </Link>
          </div>
        </div>
      </Card>

      <Card>
        <CardHeader>
          <div>
            <CardTitle>Tạo bộ đề</CardTitle>
            <CardDescription>
              Cấu hình số câu/bài, sai tối đa, và số bộ trộn cho ngân hàng này.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <Form action={createExam} className="grid gap-3">
          <input type="hidden" name="bankId" value={bankId} />
          <input type="hidden" name="returnTo" value={`/admin/banks/${bankId}`} />

          <div className="grid gap-1">
            <Label htmlFor="examName">Tên bộ đề</Label>
            <Input
              id="examName"
              name="name"
              required
              defaultValue={`${bank.title} — ${new Date().toLocaleDateString("vi-VN")}`}
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="grid gap-1">
              <Label htmlFor="questionsPerTest">Số câu / bài</Label>
              <Input
                id="questionsPerTest"
                name="questionsPerTest"
                type="number"
                min={1}
                defaultValue={30}
              />
            </div>
            <div className="grid gap-1">
              <Label htmlFor="maxWrongAllowed">Sai tối đa</Label>
              <Input
                id="maxWrongAllowed"
                name="maxWrongAllowed"
                type="number"
                min={0}
                defaultValue={3}
              />
            </div>
            <div className="grid gap-1">
              <Label htmlFor="variantCount">Số bộ trộn</Label>
              <Input
                id="variantCount"
                name="variantCount"
                type="number"
                min={1}
                max={50}
                defaultValue={10}
              />
            </div>
          </div>

          <div className="grid gap-1">
            <Label htmlFor="timeLimitMinutes">Thời gian (phút)</Label>
            <Input
              id="timeLimitMinutes"
              name="timeLimitMinutes"
              type="number"
              min={1}
              placeholder="Không giới hạn"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <Button type="submit">Tạo bộ đề</Button>
            <div className="text-xs text-zinc-500">
              Sau khi tạo, user sẽ thấy các bộ trộn trong mục Thi thử.
            </div>
          </div>
          </Form>

        <div className="mt-6">
          <div className="text-sm font-medium">Bộ đề đã tạo</div>
          <div className="mt-2 grid gap-2">
            {exams.map((e) => (
              <div key={e.id} className="rounded-xl border bg-white px-4 py-3 shadow-sm">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <div className="font-medium">{e.name}</div>
                  <div className="text-xs text-zinc-500">
                    {e._count.variants} bộ trộn • {e.questionsPerTest} câu • sai tối đa{" "}
                    {e.maxWrongAllowed}
                  </div>
                </div>
              </div>
            ))}
            {!exams.length ? (
              <div className="text-sm text-zinc-600">Chưa có bộ đề cho ngân hàng này.</div>
            ) : null}
          </div>
        </div>
        </CardContent>
      </Card>

      <div className="grid gap-3">
        {questions.map((q) => (
          <Card key={q.id}>
            <div className="text-sm font-semibold">Câu {q.ordinal}</div>
            <div className="mt-2 text-sm text-zinc-800">{q.text}</div>
            <div className="mt-3 grid gap-1 text-sm text-zinc-700">
              <div>A. {q.optionA}</div>
              <div>B. {q.optionB}</div>
              <div>C. {q.optionC}</div>
              <div>D. {q.optionD}</div>
            </div>

            <Form action={updateQuestion} className="mt-4 flex flex-wrap items-center gap-3">
              <input type="hidden" name="questionId" value={q.id} />
              <input
                type="hidden"
                name="returnTo"
                value={`/admin/banks/${bankId}?page=${currentPage}`}
              />
              <div className="flex items-center gap-2">
                <span className="text-sm text-zinc-600">Đáp án</span>
                <Select
                  name="correctOption"
                  defaultValue={q.correctOption ?? ""}
                  className="h-9 w-auto px-2"
                >
                  <option value="">(chưa set)</option>
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                  <option value="D">D</option>
                </Select>
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input name="isCritical" type="checkbox" defaultChecked={q.isCritical} />
                <span>Câu điểm liệt</span>
              </label>
              <Button size="sm" type="submit">
                Lưu
              </Button>
            </Form>

            <Form action={deleteQuestion} className="mt-3">
              <input type="hidden" name="questionId" value={q.id} />
              <input
                type="hidden"
                name="returnTo"
                value={`/admin/banks/${bankId}?page=${currentPage}`}
              />
              <Button variant="destructive" size="sm" type="submit">
                Xoá câu này
              </Button>
            </Form>
          </Card>
        ))}
      </div>
    </div>
  );
}
