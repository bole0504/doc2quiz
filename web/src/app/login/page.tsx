import Form from "next/form";
import Link from "next/link";
import { login } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: { error?: string } | Promise<{ error?: string }>;
}) {
  const { error } = await Promise.resolve(searchParams);

  return (
    <div className="mx-auto max-w-md">
      <Card>
        <CardHeader>
          <div>
            <CardTitle className="text-xl">Đăng nhập</CardTitle>
            <CardDescription>Đăng nhập để lưu tiến độ/kết quả làm bài.</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="mb-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              Email hoặc mật khẩu không đúng.
            </div>
          ) : null}

          <Form action={login} className="grid gap-3">
            <div className="grid gap-1">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" required />
            </div>
            <div className="grid gap-1">
              <Label htmlFor="password">Mật khẩu</Label>
              <Input id="password" name="password" type="password" required />
            </div>
            <Button type="submit">Đăng nhập</Button>
          </Form>
        </CardContent>
      </Card>

      <p className="mt-3 text-sm text-zinc-600">
        Chưa có chức năng đăng ký trong MVP. Dùng tài khoản admin seed (xem
        `web/.env`) hoặc nhờ admin tạo user.
      </p>
      <p className="mt-2 text-sm">
        <Link className="text-zinc-900 underline" href="/">
          Về trang chủ
        </Link>
      </p>
    </div>
  );
}
