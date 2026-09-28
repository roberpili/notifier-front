import type { LoginPayload, LoginResponse } from "@/types/user";
import { API_BASE_URL } from "./payment";

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
  if (
    typeof record.token !== "string" ||
    typeof record.email !== "string" ||
    (typeof record.id !== "number" && typeof record.id !== "string")
  ) {
    return null;
  }

  return {
    id: Number(record.id),
    email: record.email,
    token: record.token,
  };
}

export async function loginRequest(
  payload: LoginPayload,
): Promise<LoginResponse> {
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

  return result;
}
