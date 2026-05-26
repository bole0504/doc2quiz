import { z } from "zod";
import { handleApiError, jsonError, jsonOk } from "@/lib/api/request";
import { resolveUserFromRequest } from "@/lib/api/auth";
import { openVariant } from "@/lib/services/quizService";

const bodySchema = z.object({
  variantId: z.string().min(1),
});

export async function POST(req: Request) {
  try {
    const user = await resolveUserFromRequest(req);
    if (!user) return jsonError("UNAUTHORIZED", 401);
    const body = bodySchema.parse(await req.json());
    const data = await openVariant(user.id, body.variantId);
    return jsonOk(data);
  } catch (err) {
    return handleApiError(err);
  }
}
