import type { RegisterValues } from "@/types/registration";

export function validateRegister(values: RegisterValues): string | null {
  if (!values.username.trim()) {
    return "username is required";
  }

  if (!values.email.trim()) {
    return "email is required";
  }

  if (!values.password) {
    return "password is required";
  }

  if (values.password.length < 6) {
    return "password must be at least 6 characters";
  }

  if (values.confirmPassword != values.password) {
    return "passwords does not match";
  }

  return null;
}
