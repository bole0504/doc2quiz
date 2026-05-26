import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

const SESSION_COOKIE = "docx2quiz_session";

export async function resolveUserFromRequest(req: Request) {
  const auth = req.headers.get("authorization");
  if (auth?.startsWith("Bearer ")) {
    const token = auth.slice(7).trim();
    if (!token) return null;
    const session = await prisma.session.findUnique({
      where: { token },
      include: { user: true },
    });
    if (!session) return null;
    if (session.expiresAt.getTime() <= Date.now()) {
      await prisma.session.delete({ where: { token } }).catch(() => {});
      return null;
    }
    return session.user;
  }

  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const session = await prisma.session.findUnique({
    where: { token },
    include: { user: true },
  });
  if (!session) return null;
  if (session.expiresAt.getTime() <= Date.now()) {
    await prisma.session.delete({ where: { token } }).catch(() => {});
    return null;
  }
  return session.user;
}

export async function requireUserFromRequest(req: Request) {
  const user = await resolveUserFromRequest(req);
  if (!user) throw new Error("UNAUTHORIZED");
  return user;
}
