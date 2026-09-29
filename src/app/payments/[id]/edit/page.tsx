import type { Metadata } from "next";
import Link from "next/link";
import { StatusMessageComponent } from "@/components/message";
import { UpdatePaymentComponent } from "@/components/payments/update_payment";
import { parsePaymentId } from "@/utils/payments-helpers";
import { requireSession } from "@/lib/session-cookie";
import type { Payment } from "@/types/payment";
import { getPaymentById } from "@/services/payment";
import "@/app/styles/page-payments.css";

export const metadata: Metadata = {
  title: "Notifier | Update payment",
};

export default async function UpdatePaymentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const paymentId = parsePaymentId(id);

  if (paymentId === null) {
    return (
      <div className="container centered">
        <h1 className="error" role="alert">
          Invalid Payment ID
        </h1>

        <p className="link-wrapper">
          <Link href="/dashboard" className="link">
            Go back to Dashboard
          </Link>
        </p>
      </div>
    );
  }

  const token = await requireSession();

  let payment: Payment | null = null;
  let error: string | null = null;

  try {
    payment = await getPaymentById(paymentId, token);
  } catch (err) {
    error = `Error: ${err instanceof Error ? err.message : "error during fetching payment"}`;
  }

  if (error || !payment) {
    return (
      <div className="container">
        <StatusMessageComponent message={error} type="error" />
      </div>
    );
  }

  return (
    <UpdatePaymentComponent paymentId={paymentId} initialPayment={payment} />
  );
}
