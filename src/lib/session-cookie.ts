"use server";

import { SESSION_COOKIE } from "@/constants/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function getSessionToken(): Promise<string | null> {
  const cookie = (await cookies()).get(SESSION_COOKIE);

  return cookie?.value ?? null;
}

export async function requireSession(): Promise<string> {
  const token = await getSessionToken();
  if (!token) {
    redirect("/login");
  }

  return token;
}

export async function clearSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}
