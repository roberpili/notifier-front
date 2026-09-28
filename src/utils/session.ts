import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { Session } from "@/types/session";
import {
  getSession,
  SESSION_COOKIE,
  SESSION_MAX_AGE,
} from "@/lib/session-cookie";

async function setSession(session: Session): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, JSON.stringify(session), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

async function clearSession(): Promise<void> {
  (await cookies()).delete(SESSION_COOKIE);
}

export async function requireSession(): Promise<Session> {
  const session = await getSession();
  if (!session) redirect("/login");
  return session;
}
