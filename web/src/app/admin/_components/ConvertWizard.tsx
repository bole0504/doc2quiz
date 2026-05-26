"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  Check,
  FileText,
  Info,
  Sparkles,
} from "lucide-react";
import { Badge, Btn, Card, DesignInput, Field } from "@/components/design/primitives";

type PreviewResponse = {
  totalQuestions: number;
  correctDetected: number;
  preview: Array<{
    ordinalFromDoc: number;
    text: string;
    correctOption: "A" | "B" | "C" | "D" | null;
    options: Record<"A" | "B" | "C" | "D", string>;
  }>;
};

function ConvertHeader({ step }: { step: 1 | 2 | 3 }) {
  const steps = [
    { id: 1, label: "Cấu hình & trích xuất" },
    { id: 2, label: "Xem lại câu hỏi" },
    { id: 3, label: "Tạo bộ đề" },
  ] as const;
  return (
    <div>
      <h1 className="text-[22px] font-semibold tracking-[-0.02em]">
        Tạo bộ câu hỏi từ Word
      </h1>
      <p className="mt-1 text-[13.5px] text-[var(--textMuted)]">
        Tự động trích xuất câu hỏi và đáp án đúng từ file .docx của bạn
      </p>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        {steps.map((s, i) => (
          <div key={s.id} className="flex items-center gap-2">
            <div
              className={`flex h-[22px] w-[22px] items-center justify-center rounded-full text-xs font-semibold ${
                s.id <= step
                  ? "bg-[var(--p)] text-white"
                  : "bg-[var(--bgSubtle)] text-[var(--textMuted)]"
              }`}
            >
              {s.id < step ? <Check className="h-3 w-3" strokeWidth={2.5} /> : s.id}
            </div>
            <span
              className={`text-[13px] ${s.id === step ? "font-semibold" : "text-[var(--textMuted)]"}`}
            >
              {s.label}
            </span>
            {i < steps.length - 1 ? (
              <div className="mx-1 h-px w-8 bg-[var(--border)]" />
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}

function RuleFields() {
  return (
    <div className="flex flex-col gap-3.5">
      <div className="grid gap-3 sm:grid-cols-3">
        <DesignInput id="ruleFont" name="ruleFont" label="Font chữ" defaultValue="Arial" />
        <DesignInput id="ruleSize" name="ruleSize" label="Cỡ chữ (pt)" defaultValue="13.5" />
        <DesignInput
          id="ruleColorHex"
          name="ruleColorHex"
          label="Màu chữ (hex)"
          placeholder="vd: C00000"
        />
      </div>
      <div className="flex flex-wrap gap-4 text-[13px]">
        <label className="flex items-center gap-2">
          <input name="ruleBold" type="checkbox" className="accent-[var(--p)]" />
          In đậm
        </label>
        <label className="flex items-center gap-2">
          <input name="ruleItalic" type="checkbox" className="accent-[var(--p)]" />
          In nghiêng
        </label>
      </div>
    </div>
  );
}

export default function ConvertWizard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const formRef = useRef<HTMLFormElement>(null);
  const [step, setStep] = useState<1 | 2>(1);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [preview, setPreview] = useState<PreviewResponse | null>(null);
  const [bankTitle, setBankTitle] = useState("");

  useEffect(() => {
    if (searchParams.get("test") === "1" && preview) setStep(2);
  }, [searchParams, preview]);

  const onTest = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const fd = new FormData(e.currentTarget);
    setBankTitle(String(fd.get("bankTitle") ?? ""));
    try {
      const res = await fetch("/api/admin/docx/preview", { method: "POST", body: fd });
      const data = (await res.json()) as PreviewResponse & { error?: string };
      if (!res.ok) throw new Error(data.error ?? "Preview failed");
      setPreview(data);
      setStep(2);
      router.replace("/admin/convert?test=1");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lỗi không xác định");
    } finally {
      setBusy(false);
    }
  }, [router]);

  const onCreate = useCallback(async () => {
    if (!formRef.current) return;
    setBusy(true);
    setError(null);
    try {
      const fd = new FormData(formRef.current);
      const res = await fetch("/api/admin/docx/create", { method: "POST", body: fd });
      const data = (await res.json()) as { bankId?: string; error?: string };
      if (!res.ok) throw new Error(data.error ?? "Create failed");
      if (!data.bankId) throw new Error("Missing bankId");
      router.push(`/admin/convert/review?bankId=${data.bankId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lỗi không xác định");
    } finally {
      setBusy(false);
    }
  }, [router]);

  return (
    <div className="mx-auto flex max-w-[920px] flex-col gap-4">
      <ConvertHeader step={step === 1 ? 1 : 2} />

      <form ref={formRef} onSubmit={onTest} className="flex flex-col gap-4">
        {step === 1 ? (
          <>
            <Card padding={24}>
              <h2 className="text-[14.5px] font-semibold">Thông tin cơ bản</h2>
              <div className="mt-4 flex flex-col gap-4">
                <DesignInput
                  name="bankTitle"
                  label="Tên bộ câu hỏi"
                  required
                  placeholder="vd: Thi lái xe hạng B1 — 2026"
                />
                <Field label="File Word (.docx)">
                  <input
                    name="docx"
                    type="file"
                    accept=".docx"
                    required
                    className="w-full text-[13px]"
                    onChange={(ev) => setFileName(ev.target.files?.[0]?.name ?? null)}
                  />
                  {fileName ? (
                    <p className="mt-1 flex items-center gap-1 text-[12px] text-[var(--textMuted)]">
                      <FileText className="h-3.5 w-3.5" /> {fileName}
                    </p>
                  ) : null}
                </Field>
              </div>
            </Card>
            <Card padding={24}>
              <h2 className="text-[14.5px] font-semibold">Quy tắc phát hiện đáp án đúng</h2>
              <div className="mt-4">
                <RuleFields />
              </div>
            </Card>
          </>
        ) : preview ? (
          <>
            <Card padding={16} className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-[7px] bg-[var(--pSoft)] text-[var(--p)]">
                <FileText className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <div className="text-[13.5px] font-medium">{bankTitle || fileName}</div>
                <div className="text-[12px] text-[var(--textMuted)]">Kết quả thử 5 câu</div>
              </div>
              <Btn kind="ghost" size="sm" type="button" onClick={() => setStep(1)}>
                Sửa cấu hình
              </Btn>
            </Card>
            <div className="rounded-lg border border-[var(--success)]/25 bg-[var(--successSoft)] px-4 py-3">
              <div className="text-[13.5px] font-semibold text-[var(--success)]">
                Phát hiện {preview.correctDetected}/{preview.preview.length} câu trong mẫu
              </div>
              <p className="mt-1 text-[12.5px] text-[var(--textMuted)]">
                Tổng {preview.totalQuestions} câu trong file.
              </p>
            </div>
            <Card padding={0}>
              <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-3">
                <span className="text-[13.5px] font-semibold">Kết quả thử nghiệm</span>
                <Badge tone="primary">5 câu đầu tiên</Badge>
              </div>
              {preview.preview.map((q) => (
                <div
                  key={q.ordinalFromDoc}
                  className="border-b border-[var(--border)] px-4 py-4 last:border-0"
                >
                  <div className="flex items-center gap-2 text-[13px] font-semibold">
                    Câu {q.ordinalFromDoc}
                    {q.correctOption ? (
                      <Badge tone="primary">Đúng: {q.correctOption}</Badge>
                    ) : (
                      <Badge tone="danger">Không phát hiện</Badge>
                    )}
                  </div>
                  <p className="mt-2 text-[13.5px]">{q.text}</p>
                </div>
              ))}
            </Card>
          </>
        ) : null}

        {error ? (
          <div className="rounded-lg border border-[var(--danger)] bg-[var(--dangerSoft)] px-4 py-3 text-sm text-[var(--danger)]">
            {error}
          </div>
        ) : null}

        <div className="sticky bottom-0 flex flex-wrap items-center justify-between gap-3 rounded-[10px] border border-[var(--border)] bg-[var(--bg)] p-4 shadow-[var(--cardShadow)]">
          {step === 1 ? (
            <>
              <p className="flex items-center gap-1.5 text-[12.5px] text-[var(--textMuted)]">
                <Info className="h-3.5 w-3.5" />
                Thử với 5 câu trước khi trích xuất toàn bộ
              </p>
              <div className="flex gap-2">
                <Link href="/admin/banks">
                  <Btn kind="secondary">Hủy</Btn>
                </Link>
                <Btn
                  kind="primary"
                  type="submit"
                  disabled={busy}
                  iconRight={<ArrowRight className="h-4 w-4" />}
                >
                  {busy ? "Đang xử lý..." : "Thử với 5 câu"}
                </Btn>
              </div>
            </>
          ) : (
            <>
              <span className="text-[13px] text-[var(--textMuted)]">
                Trích xuất ~{preview?.totalQuestions ?? 0} câu
              </span>
              <div className="flex gap-2">
                <Btn kind="secondary" type="button" onClick={() => setStep(1)}>
                  Thử lại
                </Btn>
                <Btn
                  kind="primary"
                  type="button"
                  disabled={busy}
                  onClick={onCreate}
                  icon={<Sparkles className="h-4 w-4" />}
                  iconRight={<ArrowRight className="h-4 w-4" />}
                >
                  {busy ? "Đang trích xuất..." : "Trích xuất toàn bộ"}
                </Btn>
              </div>
            </>
          )}
        </div>
      </form>
    </div>
  );
}
