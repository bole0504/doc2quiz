"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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

export default function DocxImportCard() {
  const [busy, setBusy] = useState<"idle" | "testing" | "creating">("idle");
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<PreviewResponse | null>(null);
  const [createdBankId, setCreatedBankId] = useState<string | null>(null);

  const canCreate = useMemo(() => {
    if (!preview) return false;
    return preview.totalQuestions > 0;
  }, [preview]);

  async function onTest(form: HTMLFormElement) {
    setBusy("testing");
    setError(null);
    setCreatedBankId(null);
    try {
      const fd = new FormData(form);
      const res = await fetch("/api/admin/docx/preview", { method: "POST", body: fd });
      const data = (await res.json()) as PreviewResponse & { error?: string };
      if (!res.ok) throw new Error(data.error ?? "Preview failed");
      setPreview(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
      setPreview(null);
    } finally {
      setBusy("idle");
    }
  }

  async function onCreate(form: HTMLFormElement) {
    setBusy("creating");
    setError(null);
    setCreatedBankId(null);
    try {
      const fd = new FormData(form);
      const res = await fetch("/api/admin/docx/create", { method: "POST", body: fd });
      const data = (await res.json()) as { bankId?: string; error?: string };
      if (!res.ok) throw new Error(data.error ?? "Create failed");
      if (!data.bankId) throw new Error("Missing bankId");
      setCreatedBankId(data.bankId);
      window.location.href = `/admin/banks/${data.bankId}`;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setBusy("idle");
    }
  }

  return (
    <div>
      <form
        className="mt-4 grid gap-3"
        onSubmit={(e) => e.preventDefault()}
      >
        <div className="grid gap-1">
          <Label htmlFor="bankTitle">Tên ngân hàng câu hỏi</Label>
          <Input
            id="bankTitle"
            name="bankTitle"
            required
            placeholder="vd: Luật đấu thầu - 390 câu"
          />
        </div>

        <div className="grid gap-1">
          <Label htmlFor="docx">File DOCX</Label>
          <Input id="docx" name="docx" type="file" accept=".docx" required className="h-auto py-2" />
        </div>

        <Card className="bg-white p-4">
          <div className="text-sm font-medium">Rule nhận biết đáp án đúng</div>
          <p className="mt-1 text-xs text-zinc-600">
            Khớp style của option đúng. Mặc định: Arial + Bold + Italic + 13.5pt.
          </p>
          <div className="mt-2 grid gap-3 sm:grid-cols-6">
            <div className="grid gap-1 sm:col-span-2">
              <Label className="text-xs text-zinc-600" htmlFor="ruleFont">
                Font
              </Label>
              <Input
                id="ruleFont"
                name="ruleFont"
                defaultValue="Arial"
                className="h-9"
              />
            </div>
            <div className="grid gap-1 sm:col-span-2">
              <Label className="text-xs text-zinc-600" htmlFor="ruleSize">
                Size (pt)
              </Label>
              <Input
                id="ruleSize"
                name="ruleSize"
                defaultValue="13.5"
                inputMode="decimal"
                className="h-9"
              />
            </div>
            <div className="grid gap-1 sm:col-span-2">
              <Label className="text-xs text-zinc-600" htmlFor="ruleColorHex">
                Color (hex, optional)
              </Label>
              <Input
                id="ruleColorHex"
                name="ruleColorHex"
                placeholder="vd: 28A745"
                className="h-9"
              />
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-4 text-sm">
            <label className="flex items-center gap-2">
              <input name="ruleBold" type="checkbox" />
              <span>Bold</span>
            </label>
            <label className="flex items-center gap-2">
              <input name="ruleItalic" type="checkbox" />
              <span>Italic</span>
            </label>
            <div className="text-xs text-zinc-600">
              Gợi ý: file của bạn thường chỉ cần Font+Size+Color; Bold/Italic có thể không bật ở XML.
            </div>
          </div>
        </Card>

        {error ? (
          <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
            {error}
          </div>
        ) : null}

        {preview ? (
          <Card className="bg-white p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="text-sm font-medium">Kết quả test</div>
              <div className="text-xs text-zinc-600">
                Parse {preview.totalQuestions} câu • detect đáp án {preview.correctDetected} câu
              </div>
            </div>
            <div className="mt-3 grid gap-3">
              {preview.preview.map((q) => (
                <div key={q.ordinalFromDoc} className="rounded-md border p-3">
                  <div className="text-sm font-semibold">
                    Câu {q.ordinalFromDoc} • Đáp án: {q.correctOption ?? "(không thấy)"}
                  </div>
                  <div className="mt-1 text-sm text-zinc-800">{q.text}</div>
                </div>
              ))}
            </div>
          </Card>
        ) : null}

        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            disabled={busy !== "idle"}
            onClick={(e) => onTest((e.currentTarget as HTMLButtonElement).form!)}
            variant="outline"
          >
            Test (5 câu đầu)
          </Button>
          <Button
            type="button"
            disabled={busy !== "idle" || !canCreate}
            onClick={(e) => onCreate((e.currentTarget as HTMLButtonElement).form!)}
          >
            Tạo (manual trigger)
          </Button>
          {createdBankId ? (
            <span className="text-sm text-zinc-600">Đã tạo bank: {createdBankId}</span>
          ) : null}
        </div>
      </form>
    </div>
  );
}
