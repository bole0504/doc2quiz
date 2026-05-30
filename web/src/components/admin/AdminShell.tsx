"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Form from "next/form";
import { useState } from "react";
import {
  BookOpen,
  FileText,
  Grid3X3,
  LogOut,
  Menu,
  Plus,
  Search,
  Users,
  X,
} from "lucide-react";
import { logout } from "@/app/actions/auth";
import { Avatar } from "@/components/design/primitives";
import { LogoMark } from "@/components/Logo";
import { DarkModeToggle } from "@/components/admin/DarkModeToggle";
import { cn } from "@/lib/utils";

const NAV = [
  { id: "dashboard", href: "/admin/dashboard", label: "Tổng quan", icon: Grid3X3 },
  { id: "banks", href: "/admin/banks", label: "Ngân hàng câu hỏi", icon: BookOpen },
  { id: "convert", href: "/admin/convert", label: "Tạo bộ câu hỏi", icon: Plus },
  { id: "exams", href: "/admin/exams", label: "Bộ đề thi", icon: FileText },
  { id: "users", href: "/admin/users", label: "Người dùng", icon: Users },
] as const;

export type AdminNavId = (typeof NAV)[number]["id"];

function navActive(pathname: string, id: string, href: string) {
  if (id === "dashboard") return pathname === "/admin/dashboard" || pathname === "/admin";
  if (id === "banks") return pathname.startsWith("/admin/banks");
  if (id === "convert") return pathname.startsWith("/admin/convert");
  if (id === "exams") return pathname.startsWith("/admin/exams");
  if (id === "users") return pathname.startsWith("/admin/users");
  return pathname.startsWith(href);
}

function SidebarContent({
  pathname,
  active,
  userEmail,
  collapsed,
  onClose,
}: {
  pathname: string;
  active?: AdminNavId;
  userEmail?: string;
  collapsed?: boolean;
  onClose?: () => void;
}) {
  return (
    <>
      {/* Logo */}
      <div className={cn("flex items-center gap-2.5 px-5 py-5", collapsed && "justify-center px-3")}>
        <LogoMark size={32} />
        {!collapsed && <span className="text-[15px] font-semibold tracking-[-0.02em]">doc2quiz</span>}
        {onClose && (
          <button onClick={onClose} className="ml-auto text-[var(--textMuted)] hover:text-[var(--text)]">
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className={cn("flex flex-1 flex-col gap-0.5", collapsed ? "px-2" : "px-3")}>
        {NAV.map((item) => {
          const isActive = active === item.id || navActive(pathname, item.id, item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.id}
              href={item.href}
              onClick={onClose}
              title={collapsed ? item.label : undefined}
              className={cn(
                "flex items-center rounded-[7px] py-2 text-[13.5px] font-medium transition-colors",
                collapsed ? "justify-center px-2" : "gap-2.5 px-3",
                isActive
                  ? "bg-[var(--bgSubtle)] text-[var(--text)]"
                  : "text-[var(--textMuted)] hover:bg-[var(--bgMuted)] hover:text-[var(--text)]"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" strokeWidth={1.75} />
              {!collapsed && item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className={cn("border-t border-[var(--border)] p-3", collapsed && "flex flex-col items-center")}>
        {!collapsed && (
          <div className="flex items-center gap-2 rounded-[7px] px-2 py-2">
            <Avatar name={userEmail ?? "Admin"} size={28} />
            <div className="min-w-0 flex-1">
              <div className="truncate text-[13px] font-medium">{userEmail ?? "Admin"}</div>
              <div className="text-[11px] text-[var(--textSubtle)]">Quản trị viên</div>
            </div>
          </div>
        )}
        <Form action={logout} className={cn("mt-1", collapsed && "mt-0")}>
          <button
            type="submit"
            title="Đăng xuất"
            className={cn(
              "flex items-center gap-2 rounded-[7px] px-2 py-2 text-[13px] text-[var(--textMuted)] hover:bg-[var(--bgSubtle)]",
              collapsed ? "w-full justify-center" : "w-full"
            )}
          >
            <LogOut className="h-4 w-4" strokeWidth={1.75} />
            {!collapsed && "Đăng xuất"}
          </button>
        </Form>
      </div>
    </>
  );
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
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[var(--bgMuted)] text-[var(--text)]">
      {/* Sidebar — full width ≥960, icon-only 768–959, hidden <768 */}
      <aside className="hidden w-[232px] shrink-0 flex-col border-r border-[var(--border)] bg-[var(--bg)] md:flex xl:w-[232px] [&]:max-xl:w-[64px]">
        <SidebarContent
          pathname={pathname}
          active={active}
          userEmail={userEmail}
          collapsed={false}
        />
      </aside>

      {/* Icon-only sidebar 768–1024 */}
      <aside className="hidden w-[64px] shrink-0 flex-col border-r border-[var(--border)] bg-[var(--bg)] md:flex xl:hidden">
        <SidebarContent pathname={pathname} active={active} collapsed />
      </aside>

      {/* Mobile drawer overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-[232px] flex-col border-r border-[var(--border)] bg-[var(--bg)] transition-transform md:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <SidebarContent
          pathname={pathname}
          active={active}
          userEmail={userEmail}
          onClose={() => setMobileOpen(false)}
        />
      </aside>

      {/* Main content */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 shrink-0 items-center gap-3 border-b border-[var(--border)] bg-[var(--bg)] px-4 md:px-8">
          {/* Hamburger — mobile only */}
          <button
            className="flex h-8 w-8 items-center justify-center rounded-[7px] text-[var(--textMuted)] hover:bg-[var(--bgSubtle)] md:hidden"
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="h-5 w-5" strokeWidth={1.75} />
          </button>

          {search && (
            <div className="flex h-9 flex-1 max-w-md items-center gap-2 rounded-[7px] border border-[var(--border)] bg-[var(--inputBg)] px-3">
              <Search className="h-4 w-4 text-[var(--textSubtle)]" strokeWidth={1.75} />
              <input
                type="search"
                placeholder="Tìm kiếm..."
                className="flex-1 bg-transparent text-[13.5px] outline-none placeholder:text-[var(--textSubtle)]"
              />
            </div>
          )}

          <div className="ml-auto">
            <DarkModeToggle />
          </div>
        </header>

        <main className="flex-1 overflow-auto px-4 py-6 pb-8 md:px-8">{children}</main>
      </div>
    </div>
  );
}
