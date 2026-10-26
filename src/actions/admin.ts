"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { adminLoginRequest } from "@/services/admin";
import type { AdminDeleteResult, AdminFormState } from "@/types/admin";
import { ADMIN_SESSION_COOKIE, ADMIN_SESSION_MAX_AGE } from "@/constants/admin";
import { deleteUser } from "@/services/admin_actions";

const readString = (formData: FormData, name: string): string => {
  const value = formData.get(name);
  return typeof value === "string" ? value : "";
};

export async function adminLoginAction(
  _prev: AdminFormState,
  formData: FormData,
): Promise<AdminFormState> {
  const email = readString(formData, "email").trim();
  const password = readString(formData, "password");

  if (!email || !password) {
    return { error: "email and password are required" };
  }

  try {
    const { user, setCookie } = await adminLoginRequest({ email, password });
    if (user.role !== "admin") {
      return { error: "you are not an admin" };
    }
    const token = extractCookieValue(setCookie, "session_token");

    const cookieStore = await cookies();
    cookieStore.set(ADMIN_SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: ADMIN_SESSION_MAX_AGE,
    });
  } catch (error) {
    return { error: error instanceof Error ? error.message : "login failed" };
  }

  redirect("/admin/users");
}

function extractCookieValue(setCookie: string, cookieName: string): string {
  const cookie = setCookie.split(";")[0].trim();

  const prefix = `${cookieName}=`;

  if (!cookie.startsWith(prefix)) {
    throw new Error(`cookie "${cookieName}" not found in Set-Cookie header`);
  }

  return cookie.slice(prefix.length);
}

export async function adminLogoutAction(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_SESSION_COOKIE);

  redirect("/admin");
}

export async function deleteAdminUserAction(
  userId: number,
): Promise<AdminDeleteResult> {
  try {
    await deleteUser(userId);
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "error deleting user",
    };
  }
  revalidatePath("/admin/users");

  return { error: null };
}
