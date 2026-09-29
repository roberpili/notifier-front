import type { Metadata } from "next";
import { DashboardComponent } from "@/components/dashboard";
import type { Payment } from "@/types/payment";
import { getPayments } from "@/services/payment";
import { requireSession } from "@/lib/session-cookie";
import "@/app/styles/page-dashboard.css";

export const metadata: Metadata = {
  title: "Notifier | Dashboard",
};

export default async function DashboardPage() {
  const token = await requireSession();

  let payments: Payment[] = [];
  let error: string | null = null;

  try {
    payments = await getPayments(token);
  } catch {
    error = "error fetching payments";
  }

  return (
    <div className="page">
      <DashboardComponent payments={payments} error={error} />
    </div>
  );
}
