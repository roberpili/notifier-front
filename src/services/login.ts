import type { LoginPayload, LoginResponse, LoginResult } from "@/types/user";
import { API_BASE_URL } from "./payment";
import { extractTokenFromSetCookie } from "@/utils/cookie";

function readErrorMessage(data: unknown, fallback: string): string {
  if (data && typeof data === "object") {
    const record = data as Record<string, unknown>;

    for (const key of ["message", "error"]) {
      const value = record[key];
      if (typeof value === "string" && value) return value;
    }
  }

  return fallback;
}

function toLoginResponse(data: unknown): LoginResponse | null {
  if (typeof data !== "object" || data === null) return null;

  const record = data as Record<string, unknown>;
  if (typeof record.id !== "number" || typeof record.email !== "string") {
    return null;
  }

  return {
    id: record.id,
    email: record.email,
  };
}

export async function loginRequest(
  payload: LoginPayload,
): Promise<LoginResult> {
  const response = await fetch(`${API_BASE_URL}/v1/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  let data: unknown = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    throw new Error(readErrorMessage(data, "login failed"));
  }

  const result = toLoginResponse(data);
  if (!result) {
    throw new Error("login failed: unexpected response from the server");
  }

  const token = extractTokenFromSetCookie(response.headers);
  if (!token) {
    throw new Error("login failed: no session cookie received");
  }

  return { ...result, token };
}
