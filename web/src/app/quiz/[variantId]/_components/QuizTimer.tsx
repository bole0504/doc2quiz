"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Form from "next/form";
import { submitAttempt } from "@/app/actions/quiz";

function formatMs(ms: number) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

export function QuizTimer(props: { attemptId: string; variantId: string; deadlineMs: number }) {
  const { attemptId, variantId, deadlineMs } = props;
  const [nowMs, setNowMs] = useState(() => Date.now());
  const hasSubmittedRef = useRef(false);
  const remainingMs = useMemo(() => Math.max(0, deadlineMs - nowMs), [deadlineMs, nowMs]);

  useEffect(() => {
    const t = setInterval(() => setNowMs(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (remainingMs > 0) return;
    if (hasSubmittedRef.current) return;
    hasSubmittedRef.current = true;
    const form = document.getElementById("quiz-timeout-submit") as HTMLFormElement | null;
    form?.requestSubmit?.();
  }, [remainingMs]);

  return (
    <div className="rounded-full bg-white/15 px-3 py-1 text-sm font-semibold text-white">
      Còn lại: {formatMs(remainingMs)}
      <Form id="quiz-timeout-submit" action={submitAttempt} className="hidden">
        <input type="hidden" name="attemptId" value={attemptId} />
        <input type="hidden" name="variantId" value={variantId} />
      </Form>
    </div>
  );
}

