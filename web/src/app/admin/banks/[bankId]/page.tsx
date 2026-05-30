import Form from "next/form";
import Link from "next/link";
import { ArrowLeft, ChevronLeft, ChevronRight, Plus, Trash2 } from "lucide-react";
import { prisma } from "@/lib/prisma";
import {
  deleteBank,
  deleteExam,
  deleteQuestion,
  createExam,
  updateQuestion,
} from "@/app/actions/admin";
import { Badge, Btn, Card, DesignInput, Field } from "@/components/design/primitives";

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
    return <div className="text-[13.5px] text-[var(--textMuted)]">Thiếu bankId.</div>;
  }

  const { page } = await Promise.resolve(searchParams ?? {});
  const pageSize = 25;
  const requestedPage = Math.max(1, Number(page ?? "1") || 1);
  const bank = await prisma.questionBank.findUnique({
    where: { id: bankId },
    include: { category: true },
  });

  if (!bank) {
    return <div className="text-[13.5px] text-[var(--textMuted)]">Không tìm thấy ngân hàng.</div>;
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

  const detectedCount = questions.filter((q) => q.correctOption).length;
  const criticalCount = questions.filter((q) => q.isCritical).length;
  const returnTo = `/admin/banks/${bankId}?page=${currentPage}`;

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <Link
            href="/admin/banks"
            className="inline-flex items-center gap-1 text-[12.5px] text-[var(--textMuted)] hover:text-[var(--text)]"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Quay lại ngân hàng câu hỏi
          </Link>
          <h1 className="text-[22px] font-semibold tracking-[-0.02em]">{bank.title}</h1>
          <div className="flex flex-wrap items-center gap-2 text-[13px] text-[var(--textMuted)]">
            <Badge tone="primary">{bank.category.name}</Badge>
            <span>•</span>
            <span>{total} câu</span>
            <span>•</span>
            <span>Đã có đáp án: {detectedCount}/{questions.length} (trang)</span>
            {criticalCount > 0 && (
              <>
                <span>•</span>
                <Badge tone="warning">{criticalCount} câu liệt</Badge>
              </>
            )}
          </div>
        </div>
        <Form action={deleteBank}>
          <input type="hidden" name="bankId" value={bankId} />
          <Btn kind="danger" size="sm" type="submit">
            <Trash2 className="mr-1 h-3.5 w-3.5" /> Xoá ngân hàng
          </Btn>
        </Form>
      </div>

      {/* Tạo bộ đề */}
      <Card padding={20}>
        <div className="flex items-baseline justify-between gap-2">
          <div>
            <h2 className="text-[14.5px] font-semibold">Tạo bộ đề thi</h2>
            <p className="mt-0.5 text-[12.5px] text-[var(--textMuted)]">
              Cấu hình số câu/bài, sai tối đa, và số bộ trộn cho ngân hàng này.
            </p>
          </div>
        </div>

        <Form action={createExam} className="mt-4 flex flex-col gap-4">
          <input type="hidden" name="bankId" value={bankId} />
          <input type="hidden" name="returnTo" value={`/admin/banks/${bankId}`} />

          <DesignInput
            id="examName"
            name="name"
            label="Tên bộ đề"
            required
            defaultValue={`${bank.title} — ${new Date().toLocaleDateString("vi-VN")}`}
          />

          <div className="grid gap-3 sm:grid-cols-3">
            <DesignInput
              id="questionsPerTest"
              name="questionsPerTest"
              type="number"
              min={1}
              label="Số câu / bài"
              defaultValue={30}
            />
            <DesignInput
              id="maxWrongAllowed"
              name="maxWrongAllowed"
              type="number"
              min={0}
              label="Sai tối đa"
              defaultValue={3}
            />
            <DesignInput
              id="variantCount"
              name="variantCount"
              type="number"
              min={1}
              max={50}
              label="Số bộ trộn"
              defaultValue={10}
            />
          </div>

          <DesignInput
            id="timeLimitMinutes"
            name="timeLimitMinutes"
            type="number"
            min={1}
            label="Thời gian (phút)"
            placeholder="Để trống = không giới hạn"
          />

          <div className="flex flex-wrap items-center justify-between gap-3">
            <Btn kind="primary" type="submit">
              <Plus className="mr-1 h-4 w-4" /> Tạo bộ đề
            </Btn>
            <span className="text-[12px] text-[var(--textSubtle)]">
              Sau khi tạo, user sẽ thấy các bộ trộn trong mục Thi thử.
            </span>
          </div>
        </Form>

        {exams.length > 0 && (
          <div className="mt-5">
            <div className="text-[13px] font-medium">Bộ đề đã tạo ({exams.length})</div>
            <div className="mt-2 grid gap-2">
              {exams.map((e) => (
                <div
                  key={e.id}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-[8px] border border-[var(--border)] px-4 py-2.5"
                >
                  <div className="text-[13.5px] font-medium">{e.name}</div>
                  <div className="flex items-center gap-2 text-[12px] text-[var(--textMuted)]">
                    <Badge tone="default">{e._count.variants} bộ trộn</Badge>
                    <span>{e.questionsPerTest} câu • sai tối đa {e.maxWrongAllowed}</span>
                    {e.timeLimitMinutes && <Badge tone="primary">{e.timeLimitMinutes}&apos;</Badge>}
                    <Form action={deleteExam}>
                      <input type="hidden" name="examId" value={e.id} />
                      <input type="hidden" name="returnTo" value={returnTo} />
                      <Btn kind="danger" size="sm" type="submit" title="Xoá bộ đề">
                        <Trash2 className="h-3.5 w-3.5" />
                      </Btn>
                    </Form>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* Danh sách câu hỏi + paging */}
      <Card padding={0}>
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border)] px-5 py-3">
          <div className="text-[13.5px] font-semibold">
            Danh sách câu hỏi{" "}
            <span className="ml-2 text-[12.5px] font-normal text-[var(--textMuted)]">
              {skip + 1}–{Math.min(skip + pageSize, total)} / {total}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Link href={`/admin/banks/${bankId}?page=1`}>
              <Btn kind="secondary" size="sm" disabled={currentPage === 1}>
                Đầu
              </Btn>
            </Link>
            <Link href={`/admin/banks/${bankId}?page=${Math.max(1, currentPage - 1)}`}>
              <Btn kind="secondary" size="sm" disabled={currentPage === 1}>
                <ChevronLeft className="h-3.5 w-3.5" />
              </Btn>
            </Link>
            <span className="px-2 text-[12.5px] text-[var(--textMuted)]">
              Trang {currentPage}/{pageCount}
            </span>
            <Link href={`/admin/banks/${bankId}?page=${Math.min(pageCount, currentPage + 1)}`}>
              <Btn kind="secondary" size="sm" disabled={currentPage === pageCount}>
                <ChevronRight className="h-3.5 w-3.5" />
              </Btn>
            </Link>
            <Link href={`/admin/banks/${bankId}?page=${pageCount}`}>
              <Btn kind="secondary" size="sm" disabled={currentPage === pageCount}>
                Cuối
              </Btn>
            </Link>
          </div>
        </div>

        <div className="divide-y divide-[var(--border)]">
          {questions.map((q) => (
            <div key={q.id} className="px-5 py-4">
              <div className="flex items-start gap-3">
                <div className="shrink-0 rounded-[6px] bg-[var(--bgSubtle)] px-2 py-0.5 text-[12px] font-semibold text-[var(--textMuted)]">
                  Câu {q.ordinal}
                </div>
                <div className="flex-1 text-[13.5px] leading-relaxed text-[var(--text)]">
                  {q.text}
                </div>
                {q.isCritical && <Badge tone="warning">Điểm liệt</Badge>}
                {q.correctOption ? (
                  <Badge tone="success">Đáp án: {q.correctOption}</Badge>
                ) : (
                  <Badge tone="danger">Chưa có đáp án</Badge>
                )}
              </div>

              <div className="mt-3 grid gap-1.5 pl-[68px] text-[13px] text-[var(--textMuted)] sm:grid-cols-2">
                {(["A", "B", "C", "D"] as const).map((letter) => {
                  const text = q[`option${letter}` as const];
                  const isCorrect = q.correctOption === letter;
                  return (
                    <div
                      key={letter}
                      className={
                        isCorrect
                          ? "rounded-[6px] bg-[var(--successSoft)] px-2 py-1 text-[var(--success)]"
                          : "px-2 py-1"
                      }
                    >
                      <span className="font-semibold">{letter}.</span> {text}
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-3 pl-[68px]">
                <Form action={updateQuestion} className="flex flex-wrap items-center gap-3">
                  <input type="hidden" name="questionId" value={q.id} />
                  <input type="hidden" name="returnTo" value={returnTo} />
                  <Field label="Đáp án đúng">
                    <select
                      name="correctOption"
                      defaultValue={q.correctOption ?? ""}
                      className="h-8 rounded-[7px] border border-[var(--border)] bg-[var(--inputBg)] px-2 text-[13px] outline-none focus:border-[var(--p)]"
                    >
                      <option value="">— chưa set —</option>
                      <option value="A">A</option>
                      <option value="B">B</option>
                      <option value="C">C</option>
                      <option value="D">D</option>
                    </select>
                  </Field>
                  <label className="flex items-center gap-2 text-[13px]">
                    <input
                      name="isCritical"
                      type="checkbox"
                      defaultChecked={q.isCritical}
                      className="accent-[var(--p)]"
                    />
                    <span>Câu điểm liệt</span>
                  </label>
                  <Btn kind="primary" size="sm" type="submit">
                    Lưu
                  </Btn>
                </Form>

                <Form action={deleteQuestion}>
                  <input type="hidden" name="questionId" value={q.id} />
                  <input type="hidden" name="returnTo" value={returnTo} />
                  <Btn kind="danger" size="sm" type="submit">
                    <Trash2 className="mr-1 h-3.5 w-3.5" /> Xoá câu
                  </Btn>
                </Form>
              </div>
            </div>
          ))}

          {questions.length === 0 && (
            <div className="px-5 py-12 text-center text-[13.5px] text-[var(--textMuted)]">
              Ngân hàng này chưa có câu hỏi nào.
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
