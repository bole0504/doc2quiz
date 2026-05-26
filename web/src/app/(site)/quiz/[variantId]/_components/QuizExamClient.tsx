"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Btn } from "@/components/design/primitives";
import { ChevronLeft, X } from "lucide-react";

type ExamPayload = {
  variant: {
    id: string;
    examName: string;
    timeLimitMinutes: number | null;
    totalQuestions: number;
    deadlineMs: number | null;
  };
  attempt: { id: string; currentIndex: number; finished: boolean };
  question: {
    id: string;
    index: number;
    text: string;
    options: Record<"A" | "B" | "C" | "D", string>;
    selected: string | null;
  } | null;
};

function formatMs(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  const m = Math.floor(s / 60);
  return `${m}:${String(s % 60).padStart(2, "0")}`;
}

export function QuizExamClient({ variantId }: { variantId: string }) {
  const router = useRouter();
  const [data, setData] = useState<ExamPayload | null>(null);
  const [selected, setSelected] = useState<"A" | "B" | "C" | "D" | null>(null);
  const [busy, setBusy] = useState(false);
  const [now, setNow] = useState(Date.now());

  const load = useCallback(async () => {
    const res = await fetch(`/api/v1/variants/${variantId}`, { credentials: "include" });
    if (!res.ok) {
      router.replace("/quiz");
      return;
    }
    const json = (await res.json()) as ExamPayload;
    if (json.attempt.finished || !json.question) {
      router.replace("/quiz");
      return;
    }
    setData(json);
    setSelected((json.question.selected as "A" | "B" | "C" | "D") ?? null);
  }, [variantId, router]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const remainingMs = useMemo(() => {
    if (!data?.variant.deadlineMs) return null;
    return Math.max(0, data.variant.deadlineMs - now);
  }, [data, now]);

  const timerTone = useMemo(() => {
    if (remainingMs == null) return "default";
    if (remainingMs <= 60_000) return "danger";
    if (remainingMs <= 5 * 60_000) return "warning";
    return "default";
  }, [remainingMs]);

  useEffect(() => {
    if (remainingMs === 0 && data) {
      submit();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remainingMs === 0]);

  async function goNext() {
    if (!data?.question || !selected) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/v1/attempts/${data.attempt.id}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          variantId,
          questionId: data.question.id,
          selected,
        }),
      });
      const json = await res.json();
      if (json.finished) {
        router.push(`/quiz/${variantId}/result?attemptId=${data.attempt.id}`);
        return;
      }
      await load();
      setSelected(null);
    } finally {
      setBusy(false);
    }
  }

  async function submit() {
    if (!data) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/v1/attempts/${data.attempt.id}/submit`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ variantId }),
      });
      if (res.ok) {
        router.push(`/quiz/${variantId}/result?attemptId=${data.attempt.id}`);
      }
    } finally {
      setBusy(false);
    }
  }

  if (!data?.question) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-[var(--textMuted)]">
        Đang tải...
      </div>
    );
  }

  const { question, variant, attempt } = data;
  const isLast = question.index + 1 >= variant.totalQuestions;
  const letters = ["A", "B", "C", "D"] as const;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[var(--bg)]">
      <header className="flex items-center justify-between gap-3 border-b border-[var(--border)] px-5 py-4">
        <div className="min-w-0 flex-1">
          <div className="truncate text-[14px] font-semibold">{variant.examName}</div>
          <div className="text-[12px] text-[var(--textMuted)]">
            Câu {question.index + 1}/{variant.totalQuestions}
          </div>
        </div>
        {remainingMs != null ? (
          <div
            className={`rounded-full px-3 py-1 text-[13px] font-semibold ${
              timerTone === "danger"
                ? "bg-[var(--dangerSoft)] text-[var(--danger)]"
                : timerTone === "warning"
                  ? "bg-[var(--warningSoft)] text-[var(--warning)]"
                  : "bg-[var(--bgSubtle)] text-[var(--text)]"
            }`}
          >
            {formatMs(remainingMs)}
          </div>
        ) : null}
        <Link
          href="/quiz"
          className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-[var(--bgSubtle)]"
          aria-label="Đóng"
        >
          <X className="h-5 w-5" />
        </Link>
      </header>

      <div className="flex-1 overflow-y-auto px-5 py-6">
        <p className="text-[18px] font-semibold leading-snug tracking-[-0.015em]">
          {question.text}
        </p>
        <div className="mt-6 flex flex-col gap-3">
          {letters.map((letter) => (
            <button
              key={letter}
              type="button"
              onClick={() => setSelected(letter)}
              className={`flex min-h-[64px] items-center rounded-[14px] border px-4 py-3 text-left text-[15px] transition ${
                selected === letter
                  ? "border-[var(--p)] bg-[var(--pSoft)] font-medium"
                  : "border-[var(--border)] bg-[var(--inputBg)]"
              }`}
            >
              <span className="mr-3 font-semibold text-[var(--textMuted)]">{letter}</span>
              {question.options[letter]}
            </button>
          ))}
        </div>
      </div>

      <footer className="flex gap-3 border-t border-[var(--border)] px-5 py-4">
        <Btn
          kind="ghost"
          disabled={question.index === 0 || busy}
          icon={<ChevronLeft className="h-4 w-4" />}
        >
          Câu trước
        </Btn>
        <Btn
          kind={isLast ? "dangerSolid" : "primary"}
          fullWidth
          disabled={!selected || busy}
          onClick={isLast ? submit : goNext}
        >
          {busy ? "..." : isLast ? "Nộp bài" : "Tiếp theo"}
        </Btn>
      </footer>
    </div>
  );
}
