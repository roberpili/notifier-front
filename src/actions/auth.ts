"use server";

import { redirect } from "next/navigation";
import { clearSession, setSession } from "@/utils/session";
import { loginRequest } from "@/services/login";
import { registerRequest } from "@/services/register";
import { validateRegister } from "@/lib/register-validation";
import type { AuthFormState, RegisterFormState } from "@/types/auth";

const readString = (formData: FormData, name: string): string => {
  const value = formData.get(name);
  return typeof value === "string" ? value : "";
};

export async function loginAction(
  _prev: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const email = readString(formData, "email").trim();
  const password = readString(formData, "password");

  if (!email || !password) {
    return { error: "email and password are required" };
  }

  try {
    const result = await loginRequest({ email, password });
    await setSession({
      token: result.token,
      userId: result.id,
      email: result.email,
    });
  } catch (error) {
    return { error: error instanceof Error ? error.message : "login failed" };
  }

  redirect("/dashboard");
}

export async function registerAction(
  _prev: RegisterFormState,
  formData: FormData,
): Promise<RegisterFormState> {
  if (!formData.has("terms")) {
    return {
      error: "you must accept the terms and conditions.",
      success: null,
    };
  }

  const values = {
    username: readString(formData, "username").trim(),
    email: readString(formData, "email").trim(),
    password: readString(formData, "password"),
    confirmPassword: readString(formData, "confirmPassword"),
  };

  const validationError = validateRegister(values);
  if (validationError) {
    return { error: validationError, success: null };
  }

  try {
    await registerRequest({
      username: values.username,
      email: values.email,
      password: values.password,
    });
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "unknown error",
      success: null,
    };
  }

  return {
    error: null,
    success: "email sent for verification. check your email",
  };
}

export async function logoutAction(): Promise<void> {
  await clearSession();
  redirect("/");
}
