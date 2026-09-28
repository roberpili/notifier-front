import { RegisterComponent } from "@/components/login_register/register";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Notifier | Register",
};

export default function RegisterPage() {
  return <RegisterComponent />;
}
