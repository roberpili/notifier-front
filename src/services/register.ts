import type { RegisterPayload } from "@/types/user";
import { API_BASE_URL } from "./payment";

export async function registerRequest(payload: RegisterPayload): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/v1/users/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      data && typeof data === "object"
        ? (data as Record<string, unknown>).error
        : undefined;

    throw new Error(
      typeof message === "string" && message ? message : "registration failed",
    );
  }
}
