import { handleApiError, jsonError, jsonOk } from "@/lib/api/request";
import { resolveUserFromRequest } from "@/lib/api/auth";
import { getLearnerCatalog } from "@/lib/services/quizService";

export async function GET(req: Request) {
  try {
    const user = await resolveUserFromRequest(req);
    if (!user) return jsonError("UNAUTHORIZED", 401);
    const catalog = await getLearnerCatalog(user.id);
    return jsonOk({ catalog });
  } catch (err) {
    return handleApiError(err);
  }
}
