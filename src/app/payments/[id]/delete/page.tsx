import type { Metadata } from "next";
import Link from "next/link";
import { DeletePaymentComponent } from "@/components/payments/delete_payment";
import { parsePaymentId } from "@/utils/payments-helpers";

export const metadata: Metadata = {
  title: "Notifier | Delete payment",
};

export default async function DeletePaymentPage({
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

  return <DeletePaymentComponent paymentId={paymentId} />;
}
