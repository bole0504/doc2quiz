import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role !== "ADMIN") redirect("/quiz");

  return (
    <div className="grid gap-6 text-zinc-950 [&_*]:text-zinc-950">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">Admin</h1>
          <p className="text-sm">Cấu hình ngân hàng câu hỏi và bộ đề</p>
        </div>
      </div>
      {children}
    </div>
  );
}
