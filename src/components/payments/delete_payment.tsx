"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { INITIAL_PAYMENT_RESULT } from "@/constants/auth";
import { deletePaymentAction } from "@/actions/payments";
import "@/app/styles/delete-payment.css";

const REDIRECT_DELAY = 1000;

interface DeletePaymentProps {
  paymentId: number;
}

export const DeletePaymentComponent = ({ paymentId }: DeletePaymentProps) => {
  const [result, formAction, isPending] = useActionState(
    deletePaymentAction.bind(null, paymentId),
    INITIAL_PAYMENT_RESULT,
  );
  const router = useRouter();

  useEffect(() => {
    if (result?.type !== "success") return;

    const timeout = setTimeout(() => router.push("/dashboard"), REDIRECT_DELAY);
    return () => clearTimeout(timeout);
  }, [result, router]);

  return (
    <div className="delete-payment">
      <h1>Delete Payment</h1>

      <p>Are you sure you want to delete this payment?</p>

      {result && (
        <div
          className={`delete-payment-message delete-payment-message--${result.type}`}
          role="alert"
        >
          {result.message}
        </div>
      )}

      <div className="delete-payment-actions">
        <form action={formAction}>
          <button
            type="submit"
            disabled={isPending}
            className="delete-payment-delete-button"
          >
            {isPending ? "Deleting..." : "Delete"}
          </button>
        </form>

        <Link href="/dashboard" className="delete-payment-cancel">
          Cancel
        </Link>
      </div>
    </div>
  );
};
