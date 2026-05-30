import { handleApiError, jsonError, jsonOk } from "@/lib/api/request";
import { resolveUserFromRequest } from "@/lib/api/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const user = await resolveUserFromRequest(req);
    if (!user) return jsonError("UNAUTHORIZED", 401);

    const attempts = await prisma.attempt.findMany({
      where: { userId: user.id },
      orderBy: { startedAt: "desc" },
      take: 50,
      include: {
        variant: {
          include: {
            exam: { select: { name: true } },
          },
        },
      },
    });

    const history = attempts.map((a) => ({
      id: a.id,
      examName: a.variant.exam.name,
      variantIndex: a.variant.index,
      status: a.status,
      score: a.score,
      total: Array.isArray(a.variant.questionIds)
        ? (a.variant.questionIds as unknown[]).length
        : 0,
      startedAt: a.startedAt.toISOString(),
      finishedAt: a.finishedAt?.toISOString() ?? null,
    }));

    return jsonOk({ history });
  } catch (err) {
    return handleApiError(err);
  }
}
