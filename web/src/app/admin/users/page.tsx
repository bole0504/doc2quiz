import Form from "next/form";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { Badge, Btn, Card } from "@/components/design/primitives";
import { changeUserRole, deleteUser } from "@/app/actions/admin";
import { Users } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const me = await requireUser();
  if (me.role !== "ADMIN") return <p>Không có quyền.</p>;

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      name: true,
      phone: true,
      email: true,
      role: true,
      createdAt: true,
      _count: { select: { attempts: true } },
    },
  });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-[22px] font-semibold tracking-[-0.02em]">Người dùng</h1>
        <p className="mt-1 text-[13.5px] text-[var(--textMuted)]">
          {users.length} tài khoản
        </p>
      </div>

      <Card padding={0}>
        {/* Header row */}
        <div className="grid grid-cols-[1fr_140px_80px_120px] gap-4 border-b border-[var(--border)] px-5 py-3 text-[12px] font-medium uppercase tracking-wide text-[var(--textSubtle)]">
          <span>Người dùng</span>
          <span>Liên hệ</span>
          <span>Lượt thi</span>
          <span className="text-right">Thao tác</span>
        </div>

        {users.map((u) => {
          const isSelf = u.id === me.id;
          const displayName = u.name || u.phone || u.email || "—";
          const contact = u.phone ?? u.email ?? "—";
          const initials = displayName.slice(0, 2).toUpperCase();

          return (
            <div
              key={u.id}
              className="grid grid-cols-[1fr_140px_80px_120px] items-center gap-4 border-b border-[var(--border)] px-5 py-3 last:border-0"
            >
              {/* Name + avatar */}
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--pSoft)] text-[11px] font-bold text-[var(--pSoftText)]">
                  {initials}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="truncate text-[13.5px] font-medium">{displayName}</span>
                    {isSelf && <Badge tone="primary" className="text-[11px]">Bạn</Badge>}
                  </div>
                  <div className="text-[11.5px] text-[var(--textSubtle)]">
                    {u.createdAt.toLocaleDateString("vi-VN")}
                  </div>
                </div>
              </div>

              {/* Contact */}
              <span className="truncate text-[13px] text-[var(--textMuted)]">{contact}</span>

              {/* Attempts */}
              <span className="text-[13px] text-[var(--textMuted)]">{u._count.attempts}</span>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2">
                <Badge tone={u.role === "ADMIN" ? "primary" : "default"}>
                  {u.role === "ADMIN" ? "Admin" : "User"}
                </Badge>

                {!isSelf && (
                  <div className="flex gap-1">
                    <Form action={changeUserRole}>
                      <input type="hidden" name="userId" value={u.id} />
                      <input type="hidden" name="role" value={u.role === "ADMIN" ? "USER" : "ADMIN"} />
                      <Btn kind="ghost" size="sm" type="submit" title={u.role === "ADMIN" ? "Hạ xuống User" : "Nâng lên Admin"}>
                        {u.role === "ADMIN" ? "↓" : "↑"}
                      </Btn>
                    </Form>
                    <Form action={deleteUser}>
                      <input type="hidden" name="userId" value={u.id} />
                      <Btn kind="danger" size="sm" type="submit" title="Xoá">
                        ×
                      </Btn>
                    </Form>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {users.length === 0 && (
          <div className="flex flex-col items-center gap-2 py-16 text-[var(--textMuted)]">
            <Users className="h-10 w-10 opacity-30" strokeWidth={1.5} />
            <p className="text-[14px]">Chưa có người dùng nào</p>
          </div>
        )}
      </Card>
    </div>
  );
}
