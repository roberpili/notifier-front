"use client";

import { useActionState, useEffect, useReducer, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { updatePaymentAction } from "@/actions/payments";
import { INITIAL_PAYMENT_RESULT } from "@/actions/form-state";
import { paymentFormReducer, toPaymentFieldChange } from "@/lib/payment-form";
import { TextInput } from "../text_input";
import { SelectInput } from "../select_input";
import { StatusMessageComponent } from "../message";
import { CheckboxInput } from "../checkbox";
import { toFormState } from "@/lib/payments-helpers";
import type { Payment } from "@/types";

const REDIRECT_DELAY = 1000;

const PAYMENT_TYPES = [
  { label: "-- Select type --", value: "" },
  { label: "Expense", value: "expense" },
  { label: "Income", value: "income" },
  { label: "Subscription", value: "subscription" },
];

const PAYMENT_CATEGORIES = [
  { label: "-- Select category --", value: "" },
  { label: "Electronics", value: "electronics" },
  { label: "Entertainment", value: "entertainment" },
  { label: "Education", value: "education" },
  { label: "Clothing", value: "clothing" },
  { label: "Work", value: "work" },
  { label: "Sports", value: "sports" },
];

const PAYMENT_FREQUENCIES = [
  { label: "-- None --", value: "" },
  { label: "Daily", value: "daily" },
  { label: "Weekly", value: "weekly" },
  { label: "Monthly", value: "monthly" },
  { label: "Yearly", value: "yearly" },
];

interface UpdatePaymentProps {
  paymentId: number;
  initialPayment: Payment;
}

export const UpdatePaymentComponent = ({
  paymentId,
  initialPayment,
}: UpdatePaymentProps) => {
  const [payment, dispatch] = useReducer(
    paymentFormReducer,
    initialPayment,
    toFormState,
  );
  const [result, formAction, isPending] = useActionState(
    updatePaymentAction.bind(null, paymentId),
    INITIAL_PAYMENT_RESULT,
  );
  const router = useRouter();

  useEffect(() => {
    if (result?.type !== "success") return;

    const timeout = setTimeout(() => router.push("/dashboard"), REDIRECT_DELAY);
    return () => clearTimeout(timeout);
  }, [result, router]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: "change", change: toPaymentFieldChange(event) });
  };

  const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
    dispatch({ type: "change", change: toPaymentFieldChange(event) });
  };

  return (
    <section className="update-payment">
      <div className="update-payment-container">
        <div className="update-payment-card">
          <header className="update-payment-header">
            <h1>Update Payment</h1>
          </header>

          <div className="update-payment-body">
            <form action={formAction}>
              <div className="update-payment-fields">
                <TextInput
                  id="name"
                  label="Name"
                  name="name"
                  value={payment.name}
                  onChange={handleChange}
                />

                <TextInput
                  id="amount"
                  name="amount"
                  label="Amount"
                  value={payment.amount}
                  onChange={handleChange}
                />

                <SelectInput
                  id="type"
                  name="type"
                  label="Payment Type"
                  value={payment.type}
                  onChange={handleSelectChange}
                  options={PAYMENT_TYPES}
                />

                <SelectInput
                  id="category"
                  name="category"
                  label="Payment Category"
                  value={payment.category}
                  onChange={handleSelectChange}
                  options={PAYMENT_CATEGORIES}
                />

                <TextInput
                  id="payment-date"
                  name="date"
                  label="Date"
                  value={payment.date}
                  type="date"
                  onChange={handleChange}
                />
              </div>

              <hr />

              {result && (
                <div className="update-payment-message">
                  <StatusMessageComponent
                    message={result.message}
                    type={result.type}
                  />
                </div>
              )}

              <div className="update-payment-fields">
                <TextInput
                  id="payment-due-date"
                  name="due_date"
                  label="Due Date"
                  value={payment.due_date ?? ""}
                  type="date"
                  onChange={handleChange}
                />

                <TextInput
                  id="payment-paid-at"
                  name="paid_at"
                  label="Paid At"
                  value={payment.paid_at ?? ""}
                  type="date"
                  onChange={handleChange}
                />

                <SelectInput
                  id="payment-frequency"
                  name="frequency"
                  label="Frequency"
                  value={payment.frequency ?? ""}
                  onChange={handleSelectChange}
                  options={PAYMENT_FREQUENCIES}
                />

                <TextInput
                  id="payment-receipt-url"
                  name="receipt_url"
                  label="Receipt URL"
                  value={payment.receipt_url ?? ""}
                  onChange={handleChange}
                />

                <div className="update-payment-checkboxes">
                  <CheckboxInput
                    id="payment-paid"
                    name="paid"
                    label="Paid"
                    checked={payment.paid}
                    onChange={handleChange}
                  />

                  <CheckboxInput
                    id="payment-recurrent"
                    name="recurrent"
                    label="Recurrent"
                    checked={payment.recurrent}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <hr />

              <div className="update-payment-actions">
                <button
                  type="submit"
                  className="primary-button"
                  disabled={isPending}
                >
                  {isPending ? "Updating..." : "Update Payment"}
                </button>

                <Link href="/dashboard" className="update-payment-cancel">
                  {" "}
                  Cancel{" "}
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
