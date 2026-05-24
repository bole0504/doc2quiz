import { prisma } from "@/lib/prisma";
import { createBankFromDocx } from "@/app/actions/admin";

export const dynamic = "force-dynamic";

export default async function NewBankPage() {
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });

  return (
    <div className="mx-auto max-w-2xl">
      <h2 className="text-base font-semibold">Upload DOCX</h2>
      <p className="mt-1 text-sm text-zinc-600">
        Format hỗ trợ: mỗi câu bắt đầu bằng “Câu N:” và 4 dòng “A: …”, “B: …”, “C: …”, “D: …”.
      </p>

      <form
        action={createBankFromDocx}
        className="mt-4 grid gap-3 rounded-xl border bg-white p-5"
      >
        <label className="grid gap-1 text-sm">
          <span className="text-zinc-700">Tên ngân hàng</span>
          <input
            name="title"
            required
            className="rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-zinc-200"
            placeholder="vd: Luật đấu thầu - 390 câu"
          />
        </label>
        <label className="grid gap-1 text-sm">
          <span className="text-zinc-700">Category</span>
          <select
            name="categoryId"
            required
            className="rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-zinc-200"
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-1 text-sm">
          <span className="text-zinc-700">File DOCX</span>
          <input name="docx" type="file" accept=".docx" required />
        </label>
        <button className="mt-1 rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800">
          Upload & Parse
        </button>
      </form>
    </div>
  );
}
