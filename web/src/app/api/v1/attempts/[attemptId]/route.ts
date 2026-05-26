import { z } from "zod";
import { handleApiError, jsonError, jsonOk } from "@/lib/api/request";
import { resolveUserFromRequest } from "@/lib/api/auth";
import { answerQuestion } from "@/lib/services/quizService";

const bodySchema = z.object({
  variantId: z.string().min(1),
  questionId: z.string().min(1),
  selected: z.enum(["A", "B", "C", "D"]),
});

export async function PATCH(
  req: Request,
  ctx: { params: Promise<{ attemptId: string }> }
) {
  try {
    const user = await resolveUserFromRequest(req);
    if (!user) return jsonError("UNAUTHORIZED", 401);
    const { attemptId } = await ctx.params;
    const body = bodySchema.parse(await req.json());
    const result = await answerQuestion({
      userId: user.id,
      attemptId,
      variantId: body.variantId,
      questionId: body.questionId,
      selected: body.selected,
    });
    if (result.finished && result.result) {
      return jsonOk({ finished: true, ...result.result });
    }
    const { getVariantForExam } = await import("@/lib/services/quizService");
    const data = await getVariantForExam(body.variantId, user.id);
    return jsonOk({ finished: false, ...data });
  } catch (err) {
    if (err instanceof Error) {
      if (err.message === "TIMED_OUT") return jsonError("TIMED_OUT", 410);
      if (err.message === "NOT_FOUND") return jsonError("NOT_FOUND", 404);
    }
    return handleApiError(err);
  }
}
