"use server";

import { redirect } from "next/navigation";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { z } from "zod";
import {
  loginWithCredentials,
  registerUser,
  revokeSessionCookie,
  setSessionCookie,
} from "@/lib/services/authService";

const loginSchema = z.object({
  identifier: z.string().min(1), // phone or email
  password: z.string().min(1),
});

const registerSchema = z.object({
  phone: z.string().regex(/^0\d{9}$/, "Số điện thoại không hợp lệ (10 số, bắt đầu bằng 0)"),
  name: z.string().min(1, "Vui lòng nhập tên"),
  password: z.string().min(6, "Mật khẩu tối thiểu 6 ký tự"),
});

export async function login(formData: FormData) {
  const parsed = loginSchema.safeParse({
    identifier: formData.get("identifier"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    redirect("/login?error=invalid");
  }

  const { identifier, password } = parsed.data;
  let redirectTo = "/login?error=auth";
  try {
    const { token, expiresAt, user } = await loginWithCredentials(identifier, password);
    await setSessionCookie(token, expiresAt);
    redirectTo = user.role === "ADMIN" ? "/admin/dashboard" : "/quiz";
  } catch (err) {
    if (isRedirectError(err)) throw err;
  }
  redirect(redirectTo);
}

export async function register(formData: FormData) {
  const parsed = registerSchema.safeParse({
    phone: formData.get("phone"),
    name: formData.get("name"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    const msg = parsed.error.issues[0]?.message ?? "invalid";
    redirect(`/register?error=${encodeURIComponent(msg)}`);
  }

  const { phone, name, password } = parsed.data;
  let redirectTo = "/quiz";
  try {
    const { token, expiresAt } = await registerUser(phone, name, password);
    await setSessionCookie(token, expiresAt);
  } catch (err) {
    if (isRedirectError(err)) throw err;
    if (err instanceof Error && err.message === "PHONE_TAKEN") {
      redirectTo = "/register?error=" + encodeURIComponent("Số điện thoại đã được đăng ký");
    } else {
      redirectTo = "/register?error=" + encodeURIComponent("Đăng ký thất bại, vui lòng thử lại");
    }
  }
  redirect(redirectTo);
}

export async function logout() {
  await revokeSessionCookie();
  redirect("/login");
}
