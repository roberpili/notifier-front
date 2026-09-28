import type { Metadata } from "next";
import Link from "next/link";
import { StatusMessageComponent } from "@/components/message";
import { UpdatePaymentComponent } from "@/components/payments/update_payment";
import { parsePaymentId } from "@/utils/payments-helpers";
import { requireSession } from "@/utils/session";
import type { Payment } from "@/types/payment";
import { getPaymentById } from "@/services/payment";

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
      <main className="container centered">
        <h1 className="error" role="alert">
          Invalid Payment ID
        </h1>

        <p className="link-wrapper">
          <Link href="/dashboard" className="link">
            Go back to Dashboard
          </Link>
        </p>
      </main>
    );
  }

  const session = await requireSession();

  let payment: Payment | null = null;
  let error: string | null = null;

  try {
    payment = await getPaymentById(paymentId, session.token);
  } catch (err) {
    error = `Error: ${err instanceof Error ? err.message : "error during fetching payment"}`;
  }

  if (error || !payment) {
    return (
      <main className="container">
        <StatusMessageComponent message={error} type="error" />
      </main>
    );
  }

  return (
    <UpdatePaymentComponent paymentId={paymentId} initialPayment={payment} />
  );
}
