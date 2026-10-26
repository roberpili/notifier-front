"use server";

import { ADMIN_SESSION_COOKIE } from "@/constants/admin";
import { cookies } from "next/headers";

export async function getAdminSessionToken(): Promise<string | null> {
  const cookie = (await cookies()).get(ADMIN_SESSION_COOKIE);
  return cookie?.value ?? null;
}

export async function clearAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_SESSION_COOKIE);
}
