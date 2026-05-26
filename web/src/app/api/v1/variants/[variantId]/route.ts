import { handleApiError, jsonError, jsonOk } from "@/lib/api/request";
import { resolveUserFromRequest } from "@/lib/api/auth";
import { getVariantForExam } from "@/lib/services/quizService";

export async function GET(
  req: Request,
  ctx: { params: Promise<{ variantId: string }> }
) {
  try {
    const user = await resolveUserFromRequest(req);
    if (!user) return jsonError("UNAUTHORIZED", 401);
    const { variantId } = await ctx.params;
    const data = await getVariantForExam(variantId, user.id);
    return jsonOk(data);
  } catch (err) {
    if (err instanceof Error) {
      if (err.message === "NOT_FOUND") return jsonError("NOT_FOUND", 404);
      if (err.message === "TIMED_OUT") return jsonError("TIMED_OUT", 410);
    }
    return handleApiError(err);
  }
}
