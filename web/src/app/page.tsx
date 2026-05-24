import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";

export default async function Home() {
  const user = await getCurrentUser();
  return (
    <div className="grid gap-6">
      <div className="rounded-xl border bg-white p-6">
        <h1 className="text-2xl font-semibold">DOCX → Quiz trắc nghiệm</h1>
        <p className="mt-2 text-sm text-zinc-600">
          Admin upload file DOCX để parse thành ngân hàng câu hỏi, cấu hình bộ đề
          (số câu, sai bao nhiêu bị loại, câu điểm liệt), sau đó User thi thử và
          lưu tiến độ/kết quả.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href={user ? "/quiz" : "/login"}
            className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
          >
            Vào thi thử
          </Link>
          <Link
            href={user ? "/admin" : "/login"}
            className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-zinc-50"
          >
            Vào Admin
          </Link>
        </div>
      </div>
      <div className="rounded-xl border bg-white p-6">
        <h2 className="text-base font-semibold">Tình trạng MVP</h2>
        <ul className="mt-2 list-disc pl-5 text-sm text-zinc-700">
          <li>Parse DOCX theo format “Câu N:” + “A/B/C/D:”</li>
          <li>Đăng nhập để lưu lại quá trình thi</li>
          <li>Admin tạo ngân hàng câu hỏi và bộ đề (variants)</li>
        </ul>
      </div>
    </div>
  );
}
