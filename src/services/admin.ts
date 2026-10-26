import type { AdminLoginPayload, AdminLoginResponse } from "@/types/admin";
import { parseError } from "./helpers";
import { cookies } from "next/headers";
import { ADMIN_SESSION_COOKIE } from "@/constants/admin";

export const ADMIN_API_BASE_URL = "http://localhost:8080";

export async function adminRequest<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const cookieStore = await cookies();
  const adminToken = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  const headers = new Headers(init.headers);

  if (init.body) {
    headers.set("Content-Type", "application/json");
  }

  if (adminToken) {
    headers.set("cookie", `session_token=${adminToken}`);
  }

  const response = await fetch(`${ADMIN_API_BASE_URL}${path}`, {
    ...init,
    headers,
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export async function adminLoginRequest(
  payload: AdminLoginPayload,
): Promise<AdminLoginResponse> {
  const response = await fetch(`${ADMIN_API_BASE_URL}/v1/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  const setCookie = response.headers.get("set-cookie");
  if (!setCookie) {
    throw new Error("the backend did not return an authentication cookie");
  }

  const data = await response.json();

  return {
    user: data,
    setCookie,
  };
}
