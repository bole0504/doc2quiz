import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { Btn, Card } from "@/components/design/primitives";

export default async function Home() {
  const user = await getCurrentUser();
  return (
    <div className="grid gap-6">
      <Card padding={24}>
        <h1 className="text-[22px] font-semibold tracking-[-0.02em]">
          DOCX → Quiz trắc nghiệm
        </h1>
        <p className="mt-2 text-[13.5px] text-[var(--textMuted)]">
          Admin upload file DOCX để parse thành ngân hàng câu hỏi. Người học thi
          thử trên web hoặc app mobile.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href={user ? "/quiz" : "/login"}>
            <Btn kind="primary">Vào thi thử</Btn>
          </Link>
          {user?.role === "ADMIN" ? (
            <Link href="/admin/dashboard">
              <Btn kind="secondary">Vào Admin</Btn>
            </Link>
          ) : null}
        </div>
      </Card>
    </div>
  );
}
