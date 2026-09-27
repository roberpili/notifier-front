"use client";

import { useActionState, useEffect, useReducer, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { createPaymentAction } from "@/actions/payments";
import { INITIAL_PAYMENT_RESULT } from "@/actions/form-state";
import {
  INIT_PAYMENT,
  paymentFormReducer,
  toPaymentFieldChange,
} from "@/lib/payment-form";
import { CheckboxInput } from "../checkbox";
import { SelectInput } from "../select_input";
import { TextInput } from "../text_input";
import { StatusMessageComponent } from "../message";

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

export const CreatePaymentComponent = () => {
  const [payment, dispatch] = useReducer(paymentFormReducer, INIT_PAYMENT);
  const [result, formAction, isPending] = useActionState(
    createPaymentAction,
    INITIAL_PAYMENT_RESULT,
  );
  const router = useRouter();

  useEffect(() => {
    if (result?.type !== "success") return;

    dispatch({ type: "reset" });

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
    <section className="payment-form">
      <div className="payment-form-container">
        <div className="payment-form-card">
          {/* HEADER */}
          <header className="payment-form-header">
            <h1>Register Payment</h1>
          </header>

          {/* BODY */}
          <div className="payment-form-body">
            <h2>Necessary information</h2>

            <form action={formAction}>
              <TextInput
                id="payment-name"
                label="Name"
                name="name"
                value={payment.name}
                required
                onChange={handleChange}
              />

              <TextInput
                id="payment-amount"
                label="Amount"
                name="amount"
                value={payment.amount}
                required
                onChange={handleChange}
              />

              <SelectInput
                id="payment-type"
                label="Payment Type"
                name="type"
                value={payment.type}
                required
                onChange={handleSelectChange}
                options={PAYMENT_TYPES}
              />

              <SelectInput
                id="payment-category"
                label="Payment Category"
                name="category"
                value={payment.category}
                required
                onChange={handleSelectChange}
                options={PAYMENT_CATEGORIES}
              />

              <TextInput
                id="payment-date"
                label="Date"
                name="date"
                type="date"
                value={payment.date}
                onChange={handleChange}
              />

              <hr />

              {/* Optional */}
              <h2>Optional information</h2>

              <TextInput
                id="payment-due-date"
                label="Due Date"
                name="due_date"
                type="date"
                value={payment.due_date ?? ""}
                onChange={handleChange}
              />

              <TextInput
                id="payment-paid-at"
                label="Paid At"
                name="paid_at"
                type="date"
                value={payment.paid_at ?? ""}
                onChange={handleChange}
              />

              <SelectInput
                id="payment-frequency"
                label="Frequency"
                name="frequency"
                value={payment.frequency ?? ""}
                onChange={handleSelectChange}
                options={PAYMENT_FREQUENCIES}
              />

              <TextInput
                id="payment-receipt-url"
                label="Receipt URL"
                name="receipt_url"
                type="url"
                value={payment.receipt_url ?? ""}
                onChange={handleChange}
              />

              {/* MARGIN BETWEEN CHECKBOX */}
              <div className="payment-form-checkboxes">
                <CheckboxInput
                  id="payment-paid"
                  label="Paid"
                  name="paid"
                  checked={payment.paid}
                  onChange={handleChange}
                />

                <CheckboxInput
                  id="payment-recurrent"
                  label="Recurrent"
                  name="recurrent"
                  checked={payment.recurrent}
                  onChange={handleChange}
                />
              </div>
              {/* END MARGIN CHECKBOX */}

              <div className="payment-form-submit">
                <button
                  type="submit"
                  className="primary-button"
                  disabled={isPending}
                >
                  {isPending ? "creating..." : "Create Payment"}
                </button>
              </div>

              <StatusMessageComponent
                message={result?.message ?? null}
                type={result?.type}
              />
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
