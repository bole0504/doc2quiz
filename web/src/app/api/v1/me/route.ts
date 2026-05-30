import { handleApiError, jsonError, jsonOk } from "@/lib/api/request";
import { resolveUserFromRequest } from "@/lib/api/auth";

export async function GET(req: Request) {
  try {
    const user = await resolveUserFromRequest(req);
    if (!user) return jsonError("UNAUTHORIZED", 401);
    return jsonOk({
      user: { id: user.id, name: user.name, phone: user.phone, email: user.email, role: user.role },
    });
  } catch (err) {
    return handleApiError(err);
  }
}
