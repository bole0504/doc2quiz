import * as SecureStore from "expo-secure-store";

const TOKEN_KEY = "docx2quiz_token";

export function getApiBase() {
  const url = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3000";
  return url.replace(/\/$/, "");
}

export async function getToken() {
  return SecureStore.getItemAsync(TOKEN_KEY);
}

export async function setToken(token: string) {
  await SecureStore.setItemAsync(TOKEN_KEY, token);
}

export async function clearToken() {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit & { auth?: boolean } = {}
): Promise<T> {
  const headers = new Headers(options.headers);
  if (!headers.has("Content-Type") && options.body && typeof options.body === "string") {
    headers.set("Content-Type", "application/json");
  }
  if (options.auth !== false) {
    const token = await getToken();
    if (token) headers.set("Authorization", `Bearer ${token}`);
  }
  const res = await fetch(`${getApiBase()}${path}`, { ...options, headers });
  const data = (await res.json().catch(() => ({}))) as T & { error?: string };
  if (!res.ok) {
    throw new Error(
      typeof data === "object" && data && "error" in data
        ? String((data as { error: string }).error)
        : `HTTP ${res.status}`
    );
  }
  return data;
}

export type PublicUser = {
  id: string;
  phone: string | null;
  email: string | null;
  name: string;
  role: "ADMIN" | "USER";
};

export type CatalogBank = {
  id: string;
  title: string;
  category: string;
  questionCount: number;
  exams: Array<{
    id: string;
    name: string;
    questionsPerTest: number;
    timeLimitMinutes: number | null;
    variants: Array<{
      id: string;
      index: number;
      status: string | null;
      score: number | null;
      inProgress: boolean;
    }>;
  }>;
};

export async function login(phone: string, password: string) {
  const data = await apiFetch<{ token: string; user: PublicUser }>("/api/v1/auth/login", {
    method: "POST",
    auth: false,
    body: JSON.stringify({ phone, password }),
  });
  await setToken(data.token);
  return data.user;
}

export async function logout() {
  try {
    await apiFetch("/api/v1/auth/logout", { method: "POST" });
  } finally {
    await clearToken();
  }
}

export async function fetchCatalog() {
  const data = await apiFetch<{ catalog: CatalogBank[] }>("/api/v1/catalog");
  return data.catalog;
}

export type ExamPayload = {
  variant: {
    id: string;
    examName: string;
    timeLimitMinutes: number | null;
    totalQuestions: number;
    deadlineMs: number | null;
  };
  attempt: { id: string; currentIndex: number; finished: boolean };
  question: {
    id: string;
    index: number;
    text: string;
    options: Record<"A" | "B" | "C" | "D", string>;
    selected: string | null;
  } | null;
};

export async function openVariant(variantId: string) {
  return apiFetch<ExamPayload>("/api/v1/attempts", {
    method: "POST",
    body: JSON.stringify({ variantId }),
  });
}

export async function fetchVariant(variantId: string) {
  return apiFetch<ExamPayload>(`/api/v1/variants/${variantId}`);
}

export async function answerQuestion(args: {
  attemptId: string;
  variantId: string;
  questionId: string;
  selected: "A" | "B" | "C" | "D";
}) {
  return apiFetch<
    ExamPayload & {
      finished?: boolean;
      status?: string;
      score?: number;
      total?: number;
    }
  >(`/api/v1/attempts/${args.attemptId}`, {
    method: "PATCH",
    body: JSON.stringify({
      variantId: args.variantId,
      questionId: args.questionId,
      selected: args.selected,
    }),
  });
}

export async function submitAttempt(attemptId: string, variantId: string) {
  return apiFetch<{ status: string; score: number; total: number }>(
    `/api/v1/attempts/${attemptId}/submit`,
    {
      method: "POST",
      body: JSON.stringify({ variantId }),
    }
  );
}
