import { Suspense } from "react";
import ConvertWizard from "@/app/admin/_components/ConvertWizard";

export default function AdminConvertPage() {
  return (
    <Suspense fallback={<div className="text-[var(--textMuted)]">Đang tải...</div>}>
      <ConvertWizard />
    </Suspense>
  );
}
