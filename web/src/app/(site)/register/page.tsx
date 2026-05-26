import Form from "next/form";
import Link from "next/link";
import { register } from "@/app/actions/auth";
import { Btn, Card, DesignInput } from "@/components/design/primitives";
import { LogoMark } from "@/components/Logo";

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: { error?: string } | Promise<{ error?: string }>;
}) {
  const { error } = await Promise.resolve(searchParams);

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center py-10">
      <div className="mb-8 flex flex-col items-center gap-3 text-center">
        <LogoMark size={52} />
        <div>
          <h1 className="text-[22px] font-semibold tracking-[-0.02em]">Tạo tài khoản</h1>
          <p className="mt-1 text-[13.5px] text-[var(--textMuted)]">
            Đăng ký miễn phí, bắt đầu học ngay
          </p>
        </div>
      </div>

      <Card padding={24}>
        {error ? (
          <div className="mb-4 rounded-lg border border-[var(--danger)]/30 bg-[var(--dangerSoft)] px-3 py-2.5 text-[13px] text-[var(--danger)]">
            {decodeURIComponent(error)}
          </div>
        ) : null}

        <Form action={register} className="flex flex-col gap-4">
          <DesignInput
            id="name"
            name="name"
            type="text"
            label="Họ và tên"
            placeholder="Nguyễn Văn A"
            autoComplete="name"
            required
          />
          <DesignInput
            id="phone"
            name="phone"
            type="tel"
            label="Số điện thoại"
            placeholder="0912 345 678"
            autoComplete="tel"
            hint="10 số, bắt đầu bằng 0 — dùng để đăng nhập"
            required
          />
          <DesignInput
            id="password"
            name="password"
            type="password"
            label="Mật khẩu"
            placeholder="Tối thiểu 6 ký tự"
            autoComplete="new-password"
            required
          />
          <Btn kind="primary" type="submit" fullWidth size="lg">
            Đăng ký
          </Btn>
        </Form>
      </Card>

      <p className="mt-4 text-center text-[13px] text-[var(--textMuted)]">
        Đã có tài khoản?{" "}
        <Link href="/login" className="font-medium text-[var(--p)] hover:underline">
          Đăng nhập
        </Link>
      </p>
    </div>
  );
}
