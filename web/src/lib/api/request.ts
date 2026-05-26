import { NextResponse } from "next/server";
import { ZodError } from "zod";

export function jsonOk<T>(data: T, init?: ResponseInit) {
  return NextResponse.json(data, { status: 200, ...init });
}

export function jsonError(
  message: string,
  status: number,
  code?: string
) {
  return NextResponse.json({ error: message, code }, { status });
}

export function handleApiError(err: unknown) {
  if (err instanceof ZodError) {
    return jsonError("INVALID_INPUT", 400);
  }
  if (err instanceof Error) {
    if (err.message === "UNAUTHORIZED") return jsonError("UNAUTHORIZED", 401);
    if (err.message === "FORBIDDEN") return jsonError("FORBIDDEN", 403);
    if (err.message === "NOT_FOUND") return jsonError("NOT_FOUND", 404);
    return jsonError(err.message, 400);
  }
  return jsonError("INTERNAL_ERROR", 500);
}
