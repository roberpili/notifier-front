import Link from "next/link";
import { adminLogoutAction } from "@/actions/admin";
import { Button } from "@/components/button";
import { getAdminSessionToken } from "@/lib/admin-session";
import "@/app/styles/admin.css";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = await getAdminSessionToken();

  return (
    <section className="admin">
      {token && (
        <header className="admin-nav">
          <nav className="admin-nav-links">
            <Link href="/admin/users">Users</Link>
            <Link href="/admin/payments">Payments</Link>
          </nav>

          <form action={adminLogoutAction}>
            <Button type="submit" className="primary-button logout-button">
              Log out
            </Button>
          </form>
        </header>
      )}

      <div className="admin-content">{children}</div>
    </section>
  );
}
