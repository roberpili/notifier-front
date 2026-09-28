import type { Metadata } from "next";
import { DashboardComponent } from "@/components/dashboard";
import { requireSession } from "@/utils/session";
import type { Payment } from "@/types/payment";
import { getPayments } from "@/services/payment";

export const metadata: Metadata = {
  title: "Notifier | Dashboard",
};

export default async function DashboardPage() {
  const session = await requireSession();

  let payments: Payment[] = [];
  let error: string | null = null;

  try {
    payments = await getPayments(session.userId, session.token);
  } catch {
    error = "error fetching payments";
  }

  return (
    <main className="page">
      <DashboardComponent payments={payments} error={error} />
    </main>
  );
}
