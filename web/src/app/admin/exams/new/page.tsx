import Form from "next/form";
import { prisma } from "@/lib/prisma";
import { createExam } from "@/app/actions/admin";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";

export const dynamic = "force-dynamic";

export default async function NewExamPage() {
  const banks = await prisma.questionBank.findMany({
    orderBy: { createdAt: "desc" },
    include: { category: true, _count: { select: { questions: true } } },
  });

  return (
    <div className="mx-auto max-w-2xl">
      <Card>
        <CardHeader>
          <div>
            <CardTitle>Tạo bộ đề</CardTitle>
            <CardDescription>
              Bước 2: Chọn ngân hàng câu hỏi và cấu hình số câu/bài, sai tối đa, số bộ trộn.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <Form action={createExam} className="grid gap-3">
            <input name="name" type="hidden" value={`Exam ${new Date().toISOString()}`} />

            <div className="grid gap-1">
              <Label htmlFor="bankId">Ngân hàng câu hỏi</Label>
              <Select id="bankId" name="bankId" required>
                {banks.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.title} ({b.category.name} • {b._count.questions} câu)
                  </option>
                ))}
              </Select>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="grid gap-1">
                <Label htmlFor="questionsPerTest">Số câu / bài</Label>
                <Input id="questionsPerTest" name="questionsPerTest" type="number" min={1} defaultValue={30} />
              </div>
              <div className="grid gap-1">
                <Label htmlFor="maxWrongAllowed">Sai tối đa</Label>
                <Input id="maxWrongAllowed" name="maxWrongAllowed" type="number" min={0} defaultValue={3} />
              </div>
              <div className="grid gap-1">
                <Label htmlFor="variantCount">Số bộ trộn</Label>
                <Input id="variantCount" name="variantCount" type="number" min={1} max={50} defaultValue={10} />
              </div>
            </div>

            <Button type="submit">Tạo</Button>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
