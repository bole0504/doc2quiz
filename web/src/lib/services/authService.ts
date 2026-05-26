import { nanoid } from "nanoid";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { hashPassword, verifyPassword } from "@/lib/password";

const SESSION_COOKIE = "docx2quiz_session";
const SESSION_TTL_DAYS = 30;

function addDays(date: Date, days: number) {
  const copy = new Date(date);
  copy.setDate(copy.getDate() + days);
  return copy;
}

export type PublicUser = {
  id: string;
  phone: string | null;
  email: string | null;
  name: string;
  role: "ADMIN" | "USER";
};

function toPublicUser(user: {
  id: string;
  phone: string | null;
  email: string | null;
  name: string;
  role: "ADMIN" | "USER";
}): PublicUser {
  return { id: user.id, phone: user.phone, email: user.email, name: user.name, role: user.role };
}

/** Login by phone (users) or email (admin fallback). */
export async function loginWithCredentials(identifier: string, password: string) {
  // Try phone first, then email
  const user = await prisma.user.findFirst({
    where: {
      OR: [{ phone: identifier }, { email: identifier }],
    },
  });
  if (!user) throw new Error("INVALID_CREDENTIALS");
  const ok = await verifyPassword(password, user.passwordHash);
  if (!ok) throw new Error("INVALID_CREDENTIALS");

  const token = nanoid(48);
  const expiresAt = addDays(new Date(), SESSION_TTL_DAYS);
  await prisma.session.create({
    data: { token, userId: user.id, expiresAt },
  });

  return { token, expiresAt, user: toPublicUser(user) };
}

/** Register a new user with phone + name + password. */
export async function registerUser(phone: string, name: string, password: string) {
  const existing = await prisma.user.findUnique({ where: { phone } });
  if (existing) throw new Error("PHONE_TAKEN");

  const passwordHash = await hashPassword(password);
  const user = await prisma.user.create({
    data: { phone, name, passwordHash, role: "USER" },
  });

  const token = nanoid(48);
  const expiresAt = addDays(new Date(), SESSION_TTL_DAYS);
  await prisma.session.create({
    data: { token, userId: user.id, expiresAt },
  });

  return { token, expiresAt, user: toPublicUser(user) };
}

export async function setSessionCookie(token: string, expiresAt: Date) {
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    path: "/",
  });
}

export async function revokeToken(token: string) {
  await prisma.session.deleteMany({ where: { token } });
  const store = await cookies();
  const cookieToken = store.get(SESSION_COOKIE)?.value;
  if (cookieToken === token) {
    store.delete(SESSION_COOKIE);
  }
}

export async function revokeSessionCookie() {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (token) await revokeToken(token);
  store.delete(SESSION_COOKIE);
}
