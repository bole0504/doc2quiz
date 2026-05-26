import { handleApiError, jsonOk } from "@/lib/api/request";
import { resolveUserFromRequest } from "@/lib/api/auth";
import { revokeSessionCookie, revokeToken } from "@/lib/services/authService";

export async function POST(req: Request) {
  try {
    const auth = req.headers.get("authorization");
    if (auth?.startsWith("Bearer ")) {
      await revokeToken(auth.slice(7).trim());
    } else {
      await revokeSessionCookie();
    }
    return jsonOk({ ok: true });
  } catch (err) {
    return handleApiError(err);
  }
}
