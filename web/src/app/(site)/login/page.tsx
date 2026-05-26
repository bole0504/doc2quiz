import Form from "next/form";
import Link from "next/link";
import { login } from "@/app/actions/auth";
import { Btn, Card, DesignInput } from "@/components/design/primitives";
import { LogoMark } from "@/components/Logo";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: { error?: string } | Promise<{ error?: string }>;
}) {
  const { error } = await Promise.resolve(searchParams);

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center">
      <div className="mb-8 flex flex-col items-center gap-3 text-center">
        <LogoMark size={52} />
        <div>
          <h1 className="text-[22px] font-semibold tracking-[-0.02em]">Chào mừng trở lại</h1>
          <p className="mt-1 text-[13.5px] text-[var(--textMuted)]">Đăng nhập để tiếp tục học</p>
        </div>
      </div>

      <Card padding={24}>
        {error ? (
          <div className="mb-4 rounded-lg border border-[var(--danger)]/30 bg-[var(--dangerSoft)] px-3 py-2.5 text-[13px] text-[var(--danger)]">
            Số điện thoại hoặc mật khẩu không đúng.
          </div>
        ) : null}

        <Form action={login} className="flex flex-col gap-4">
          <DesignInput
            id="identifier"
            name="identifier"
            type="tel"
            label="Số điện thoại"
            placeholder="0912 345 678"
            autoComplete="tel"
            required
          />
          <DesignInput
            id="password"
            name="password"
            type="password"
            label="Mật khẩu"
            placeholder="••••••••"
            autoComplete="current-password"
            required
          />
          <Btn kind="primary" type="submit" fullWidth size="lg">
            Đăng nhập
          </Btn>
        </Form>
      </Card>

      <p className="mt-4 text-center text-[13px] text-[var(--textMuted)]">
        Chưa có tài khoản?{" "}
        <Link href="/register" className="font-medium text-[var(--p)] hover:underline">
          Đăng ký ngay
        </Link>
      </p>
    </div>
  );
}
