import { z } from "zod";
import { handleApiError, jsonError, jsonOk } from "@/lib/api/request";
import { loginWithCredentials, setSessionCookie } from "@/lib/services/authService";

// Accept phone (users) or email (admin), plus legacy `email` field
const bodySchema = z
  .object({
    identifier: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().optional(),
    password: z.string().min(1),
  })
  .transform((d) => ({
    identifier: d.identifier ?? d.phone ?? d.email ?? "",
    password: d.password,
  }));

export async function POST(req: Request) {
  try {
    const body = bodySchema.parse(await req.json());
    const { token, expiresAt, user } = await loginWithCredentials(
      body.identifier,
      body.password
    );

    const acceptCookie =
      req.headers.get("x-docx2quiz-client") === "web" ||
      !req.headers.get("authorization");

    if (acceptCookie) {
      await setSessionCookie(token, expiresAt);
    }

    return jsonOk({ token, user, expiresAt: expiresAt.toISOString() });
  } catch (err) {
    if (err instanceof Error && err.message === "INVALID_CREDENTIALS") {
      return jsonError("INVALID_CREDENTIALS", 401);
    }
    return handleApiError(err);
  }
}
