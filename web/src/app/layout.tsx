import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import Form from "next/form";
import { getCurrentUser } from "@/lib/auth";
import { logout } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "docx2quiz",
  description: "Parse DOCX thành quiz trắc nghiệm",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();

  return (
    <html
      lang="vi"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full overflow-y-auto flex flex-col bg-gradient-to-br from-indigo-50 via-white to-emerald-50 text-zinc-900">
        <header className="sticky top-0 z-10 border-b border-white/50 bg-white/75 backdrop-blur">
          <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
            <div className="flex items-center gap-4">
              <Link href="/" className="font-semibold tracking-tight">
                docx2quiz
              </Link>
              <nav className="hidden items-center gap-1 rounded-full border bg-white/70 p-1 text-sm text-zinc-700 shadow-sm sm:flex">
                <Link
                  href="/quiz"
                  className="rounded-full px-3 py-1.5 hover:bg-zinc-100"
                >
                  Thi thử
                </Link>
                <Link
                  href="/admin"
                  className="rounded-full px-3 py-1.5 hover:bg-zinc-100"
                >
                  Admin
                </Link>
              </nav>
            </div>
            <div className="flex items-center gap-3 text-sm">
              {user ? (
                <>
                  <span className="hidden text-zinc-600 sm:inline">
                    {user.email}
                  </span>
                  <Form action={logout}>
                    <Button variant="outline" size="sm" type="submit">
                      Đăng xuất
                    </Button>
                  </Form>
                </>
              ) : (
                <Button asChild variant="outline" size="sm">
                  <Link href="/login">Đăng nhập</Link>
                </Button>
              )}
            </div>
          </div>
        </header>
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10">
          <div className="rounded-2xl border border-white/40 bg-white/60 p-5 shadow-sm sm:p-7">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
