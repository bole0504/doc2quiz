"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Form from "next/form";
import {
  BookOpen,
  FileText,
  Grid3X3,
  LogOut,
  Plus,
  Search,
  Users,
} from "lucide-react";
import { logout } from "@/app/actions/auth";
import { Avatar } from "@/components/design/primitives";
import { LogoMark } from "@/components/Logo";
import { cn } from "@/lib/utils";

const NAV = [
  { id: "dashboard", href: "/admin/dashboard", label: "Tổng quan", icon: Grid3X3 },
  { id: "banks", href: "/admin/banks", label: "Ngân hàng câu hỏi", icon: BookOpen },
  { id: "convert", href: "/admin/convert", label: "Tạo bộ câu hỏi", icon: Plus },
  { id: "exams", href: "/admin/banks", label: "Bộ đề thi", icon: FileText },
  { id: "users", href: "/admin/users", label: "Người dùng", icon: Users, phase2: true },
] as const;

export type AdminNavId = (typeof NAV)[number]["id"];

function navActive(pathname: string, id: string, href: string) {
  if (id === "dashboard") return pathname === "/admin/dashboard" || pathname === "/admin";
  if (id === "banks") return pathname.startsWith("/admin/banks");
  if (id === "convert") return pathname.startsWith("/admin/convert");
  if (id === "exams") return pathname.includes("/exams");
  return pathname.startsWith(href);
}

export function AdminShell({
  children,
  active,
  search,
  userEmail,
}: {
  children: React.ReactNode;
  active?: AdminNavId;
  search?: boolean;
  userEmail?: string;
}) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-[var(--bgMuted)] text-[var(--text)]">
      <aside className="flex w-[232px] shrink-0 flex-col border-r border-[var(--border)] bg-[var(--bg)]">
        <div className="flex items-center gap-2.5 px-5 py-5">
          <LogoMark size={32} />
          <span className="text-[15px] font-semibold tracking-[-0.02em]">doc2quiz</span>
        </div>
        <nav className="flex flex-1 flex-col gap-0.5 px-3">
          {NAV.map((item) => {
            const isActive =
              active === item.id || navActive(pathname, item.id, item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.id}
                href={item.href}
                className={cn(
                  "flex items-center gap-2.5 rounded-[7px] px-3 py-2 text-[13.5px] font-medium transition-colors",
                  isActive
                    ? "bg-[var(--bgSubtle)] text-[var(--text)]"
                    : "text-[var(--textMuted)] hover:bg-[var(--bgMuted)] hover:text-[var(--text)]",
                  "phase2" in item && item.phase2 && "opacity-60"
                )}
              >
                <Icon className="h-4 w-4 shrink-0" strokeWidth={1.75} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-[var(--border)] p-3">
          <div className="flex items-center gap-2 rounded-[7px] px-2 py-2">
            <Avatar name={userEmail ?? "Admin"} size={28} />
            <div className="min-w-0 flex-1">
              <div className="truncate text-[13px] font-medium">{userEmail ?? "Admin"}</div>
              <div className="text-[11px] text-[var(--textSubtle)]">Quản trị viên</div>
            </div>
          </div>
          <Form action={logout} className="mt-1">
            <button
              type="submit"
              className="flex w-full items-center gap-2 rounded-[7px] px-2 py-2 text-[13px] text-[var(--textMuted)] hover:bg-[var(--bgSubtle)]"
            >
              <LogOut className="h-4 w-4" strokeWidth={1.75} />
              Đăng xuất
            </button>
          </Form>
        </div>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        {search ? (
          <header className="flex h-14 shrink-0 items-center gap-3 border-b border-[var(--border)] bg-[var(--bg)] px-8">
            <div className="flex h-9 flex-1 max-w-md items-center gap-2 rounded-[7px] border border-[var(--border)] bg-[var(--inputBg)] px-3">
              <Search className="h-4 w-4 text-[var(--textSubtle)]" strokeWidth={1.75} />
              <input
                type="search"
                placeholder="Tìm kiếm..."
                className="flex-1 bg-transparent text-[13.5px] outline-none placeholder:text-[var(--textSubtle)]"
              />
            </div>
          </header>
        ) : null}
        <main className="flex-1 overflow-auto px-8 py-6 pb-8">{children}</main>
      </div>
    </div>
  );
}
