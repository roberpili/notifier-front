import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/button";
import { InputComponent } from "@/components/input";
import { StatusMessageComponent } from "@/components/message";
import type { Payment } from "@/types/payment";
import { formatDate } from "@/utils/payments-helpers";
import { getAllPayments, getPaymentById } from "@/services/admin_actions";

export const metadata: Metadata = {
  title: "Notifier | Admin payments",
};

type AdminPaymentsSearchParams = Record<string, string | string[] | undefined>;

const readParam = (value: string | string[] | undefined): string => {
  if (Array.isArray(value)) return value[0] ?? "";
  return value ?? "";
};

const parseId = (raw: string): number | null => {
  const id = Number(raw);
  return Number.isInteger(id) && id > 0 ? id : null;
};

const errorMessage = (error: unknown, fallback: string): string =>
  error instanceof Error ? error.message : fallback;

export default async function AdminPaymentsPage({
  searchParams,
}: {
  searchParams: Promise<AdminPaymentsSearchParams>;
}) {
  const params = await searchParams;
  const idQuery = readParam(params.id).trim();

  let payments: Payment[] = [];
  let paymentsError: string | null = null;

  try {
    payments = await getAllPayments();
    console.log("payments: ", payments);
  } catch (error) {
    paymentsError = errorMessage(error, "error fetching payments");
  }

  let selectedPayment: Payment | null = null;
  let lookupError: string | null = null;
  let lookupLabel: string | null = null;

  if (idQuery) {
    const paymentId = parseId(idQuery);

    if (paymentId === null) {
      lookupError = "invalid payment ID";
    } else {
      lookupLabel = `ID ${paymentId}`;

      try {
        selectedPayment = await getPaymentById(paymentId);
        console.log("user_id:", selectedPayment.user_id);
      } catch (error) {
        lookupError = errorMessage(error, "error fetching payment");
      }
    }
  }

  return (
    <div className="admin-page">
      <header className="admin-page-header">
        <div>
          <h1>Payments</h1>
        </div>

        <Link href="/admin/users" className="admin-link">
          View users
        </Link>
      </header>

      <section className="admin-card">
        <h2>Find a payment</h2>

        <form method="get" className="admin-form admin-lookup-form">
          <label htmlFor="payment-id">By ID</label>
          <div className="admin-inline-controls">
            <InputComponent
              id="payment-id"
              name="id"
              type="number"
              min="1"
              placeholder="123"
              defaultValue={idQuery}
            />
            <Button type="submit" className="primary-button">
              Search
            </Button>
          </div>
        </form>

        {lookupError && (
          <StatusMessageComponent message={lookupError} type="error" />
        )}

        {selectedPayment && (
          <div className="admin-detail">
            <h3>Payment found by {lookupLabel}</h3>

            <dl className="admin-details">
              <div>
                <dt>ID</dt>

                <dd>{selectedPayment.id}</dd>
              </div>

              <div>
                <dt>User ID</dt>
                <Link
                  href={`/admin/users?id=${selectedPayment.user_id}`}
                  className="admin-link"
                >
                  <dd>{selectedPayment.user_id}</dd>
                </Link>
              </div>

              <div>
                <dt>Name</dt>
                <dd>{selectedPayment.name}</dd>
              </div>

              <div>
                <dt>Amount</dt>
                <dd>${selectedPayment.amount}</dd>
              </div>

              <div>
                <dt>Type</dt>
                <dd>{selectedPayment.type}</dd>
              </div>

              <div>
                <dt>Category</dt>
                <dd>{selectedPayment.category}</dd>
              </div>

              <div>
                <dt>Date</dt>
                <dd>{formatDate(selectedPayment.date)}</dd>
              </div>

              <div>
                <dt>Due date</dt>
                <dd>{formatDate(selectedPayment.due_date)}</dd>
              </div>

              <div>
                <dt>Paid</dt>
                <dd>{selectedPayment.paid ? "Yes" : "No"}</dd>
              </div>

              <div>
                <dt>Paid at</dt>
                <dd>{formatDate(selectedPayment.paid_at)}</dd>
              </div>
              <div>
                <dt>Recurrent</dt>
                <dd>{selectedPayment.recurrent ? "Yes" : "No"}</dd>
              </div>
              <div>
                <dt>Frequency</dt>
                <dd>{selectedPayment.frequency || "-"}</dd>
              </div>
              <div>
                <dt>Receipt</dt>
                <dd>
                  {selectedPayment.receipt_url ? (
                    <a
                      href={selectedPayment.receipt_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="admin-link"
                    >
                      Open receipt
                    </a>
                  ) : (
                    "-"
                  )}
                </dd>
              </div>
            </dl>
          </div>
        )}

        {!lookupError && idQuery && !selectedPayment && (
          <StatusMessageComponent message="No payment found." type="error" />
        )}
      </section>

      <section className="admin-card">
        <h2>All payments</h2>

        {paymentsError ? (
          <StatusMessageComponent message={paymentsError} type="error" />
        ) : (
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>User ID</th>
                  <th>Name</th>
                  <th>Amount</th>
                  <th>Type</th>
                  <th>Category</th>
                  <th>Date</th>
                  <th>Due Date</th>
                  <th>Paid</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {payments.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="admin-empty">
                      No payments found
                    </td>
                  </tr>
                ) : (
                  payments.map((payment) => (
                    <tr key={payment.id}>
                      <td>{payment.id}</td>
                      <td>
                        <Link
                          href={`/admin/users?id=${payment.user_id}`}
                          className="admin-link"
                        >
                          {payment.user_id}
                        </Link>
                      </td>
                      <td>{payment.name}</td>
                      <td>${payment.amount}</td>
                      <td>{payment.type}</td>
                      <td>{payment.category}</td>
                      <td>{formatDate(payment.date)}</td>
                      <td>{formatDate(payment.due_date)}</td>
                      <td>{payment.paid ? "Yes" : "No"}</td>
                      <td>
                        <Link
                          href={`/admin/payments?id=${payment.id}`}
                          className="admin-link"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
