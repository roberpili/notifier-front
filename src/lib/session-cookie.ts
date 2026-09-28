import type { Session } from "@/types/session";
import { cookies } from "next/headers";

export const SESSION_COOKIE = "notifier-session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7;

export async function getSession(): Promise<Session | null> {
  return parseSession((await cookies()).get(SESSION_COOKIE)?.value);
}

function isSession(value: unknown): value is Session {
  if (typeof value !== "object" || value === null) return false;

  const candidate = value as Record<string, unknown>;

  return (
    typeof candidate.token === "string" &&
    typeof candidate.userId === "number" &&
    typeof candidate.email === "string"
  );
}

export function parseSession(raw: string | undefined): Session | null {
  if (!raw) return null;

  try {
    const parsed: unknown = JSON.parse(raw);
    return isSession(parsed) ? parsed : null;
  } catch {
    return null;
  }
}
