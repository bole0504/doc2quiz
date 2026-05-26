import { Badge, Card } from "@/components/design/primitives";

export default function AdminUsersPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-[22px] font-semibold tracking-[-0.02em]">Người dùng</h1>
        <p className="mt-1 text-[13.5px] text-[var(--textMuted)]">
          Quản lý tài khoản biên tập viên
        </p>
      </div>
      <Card padding={32} className="text-center">
        <Badge tone="warning" className="mb-3">
          Phase 2
        </Badge>
        <p className="text-[15px] font-medium">Sắp ra mắt</p>
        <p className="mt-2 text-[13px] text-[var(--textMuted)]">
          Mời người dùng, phân quyền và quản lý tài khoản sẽ có trong bản cập nhật tiếp theo.
        </p>
      </Card>
    </div>
  );
}
