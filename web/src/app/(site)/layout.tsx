import Link from "next/link";
import Form from "next/form";
import { getCurrentUser } from "@/lib/auth";
import { logout } from "@/app/actions/auth";
import { Btn } from "@/components/design/primitives";
import { Sparkles } from "lucide-react";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  return (
    <div className="flex min-h-screen flex-col bg-[var(--bgMuted)]">
      <header className="sticky top-0 z-10 border-b border-[var(--border)] bg-[var(--bg)]/90 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-5">
          <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--pSoft)] text-[var(--p)]">
              <Sparkles className="h-4 w-4" />
            </span>
            doc2quiz
          </Link>
          <nav className="flex items-center gap-2 text-[13px]">
            <Link
              href="/quiz"
              className="rounded-[7px] px-3 py-1.5 text-[var(--textMuted)] hover:bg-[var(--bgSubtle)] hover:text-[var(--text)]"
            >
              Thi thử
            </Link>
            {user?.role === "ADMIN" ? (
              <Link
                href="/admin/dashboard"
                className="rounded-[7px] px-3 py-1.5 text-[var(--textMuted)] hover:bg-[var(--bgSubtle)]"
              >
                Admin
              </Link>
            ) : null}
          </nav>
          <div className="flex items-center gap-2">
            {user ? (
              <>
                <span className="hidden text-[13px] text-[var(--textMuted)] sm:inline">
                  {user.email}
                </span>
                <Form action={logout}>
                  <Btn kind="secondary" size="sm" type="submit">
                    Đăng xuất
                  </Btn>
                </Form>
              </>
            ) : (
              <Link href="/login">
                <Btn kind="primary" size="sm">
                  Đăng nhập
                </Btn>
              </Link>
            )}
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-4xl flex-1 px-5 py-8">{children}</main>
    </div>
  );
}
