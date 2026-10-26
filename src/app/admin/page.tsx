import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminLoginComponent } from "@/components/admin/admin_login";
import { getAdminSessionToken } from "@/lib/admin-session";

export const metadata: Metadata = {
  title: "Notifier | Admin login",
};

export default async function AdminLoginPage() {
  const token = await getAdminSessionToken();

  if (token) {
    redirect("/admin/users");
  }

  return <AdminLoginComponent />;
}
