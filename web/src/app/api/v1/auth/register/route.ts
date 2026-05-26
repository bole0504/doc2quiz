import { z } from "zod";
import { handleApiError, jsonError, jsonOk } from "@/lib/api/request";
import { registerUser, setSessionCookie } from "@/lib/services/authService";

const bodySchema = z.object({
  phone: z.string().regex(/^0\d{9}$/, "Số điện thoại không hợp lệ"),
  name: z.string().min(1),
  password: z.string().min(6),
});

export async function POST(req: Request) {
  try {
    const body = bodySchema.parse(await req.json());
    const { token, expiresAt, user } = await registerUser(
      body.phone,
      body.name,
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
    if (err instanceof Error && err.message === "PHONE_TAKEN") {
      return jsonError("Số điện thoại đã được đăng ký", 409, "PHONE_TAKEN");
    }
    return handleApiError(err);
  }
}
