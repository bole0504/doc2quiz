"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { createSession, clearSession } from "@/lib/auth";
import { verifyPassword } from "@/lib/password";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function login(formData: FormData) {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    redirect("/login?error=invalid");
  }

  const { email, password } = parsed.data;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) redirect("/login?error=auth");

  const ok = await verifyPassword(password, user.passwordHash);
  if (!ok) redirect("/login?error=auth");

  await createSession(user.id);
  redirect(user.role === "ADMIN" ? "/admin" : "/quiz");
}

export async function logout() {
  await clearSession();
  redirect("/login");
}

