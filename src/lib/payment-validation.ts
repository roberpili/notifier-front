import {
  PAYMENT_CATEGORIES,
  PAYMENT_FREQUENCIES,
  PAYMENT_TYPES,
} from "@/constants/payments";
import type {
  Category,
  CreatePaymentDTO,
  Frequency,
  PaymentFormState,
  PaymentValidation,
  Type,
  ValidatedPayment,
} from "@/types/payment";

function isMember<T extends string>(
  value: string,
  allowed: readonly T[],
): value is T {
  return (allowed as readonly string[]).includes(value);
}

export function toPaymentType(value: string): Type | "" {
  return isMember(value, PAYMENT_TYPES) ? value : "";
}

export function toPaymentCategory(value: string): Category | "" {
  return isMember(value, PAYMENT_CATEGORIES) ? value : "";
}

export function toPaymentFrequency(value: string): Frequency | null {
  return isMember(value, PAYMENT_FREQUENCIES) ? value : null;
}

function validatePayment(payment: PaymentFormState): PaymentValidation {
  if (!payment.name.trim()) {
    return { ok: false, error: "Name is required" };
  }

  if (payment.amount <= 0) {
    return { ok: false, error: "Amount must be greater than 0" };
  }

  const type = toPaymentType(payment.type);
  if (!type) {
    return { ok: false, error: "Type is required" };
  }

  const category = toPaymentCategory(payment.category);
  if (!category) {
    return { ok: false, error: "Category is required" };
  }

  if (!payment.date) {
    return { ok: false, error: "Date is required" };
  }

  if (payment.recurrent && !payment.frequency) {
    return {
      ok: false,
      error: "Frequency is required for recurrent payments",
    };
  }

  if (payment.paid && !payment.paid_at) {
    return {
      ok: false,
      error: "Paid date is required when payment is marked as paid",
    };
  }

  return { ok: true, value: { ...payment, type, category } };
}

function buildPaymentDTO(payment: ValidatedPayment): CreatePaymentDTO {
  return {
    name: payment.name,
    amount: Number(payment.amount),
    type: payment.type,
    category: payment.category,
    date: payment.date,
    due_date: payment.due_date || null,
    paid: payment.paid,
    paid_at: payment.paid ? payment.paid_at || null : null,
    recurrent: payment.recurrent,
    frequency: payment.frequency || null,
    receipt_url: payment.receipt_url || null,
  };
}
