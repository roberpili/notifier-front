import type { Payment, PaymentFormState } from "@/types/payment";

export function toFormState(payment: Payment): PaymentFormState {
  return {
    id: payment.id,
    user_id: payment.user_id,
    name: payment.name,
    amount: payment.amount,
    type: payment.type,
    category: payment.category,
    date: payment.date,
    due_date: payment.due_date,
    paid: payment.paid,
    paid_at: payment.paid_at,
    recurrent: payment.recurrent,
    frequency: payment.frequency,
    receipt_url: payment.receipt_url,
  };
}

export function parsePaymentId(raw: string): number | null {
  const id = Number(raw);
  return Number.isInteger(id) && id > 0 ? id : null;
}

export function formatDate(dateStr?: string | null) {
  if (!dateStr) return "-";
  const [year, month, day] = dateStr.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function readString(formData: FormData, name: string): string {
  const value = formData.get(name);
  return typeof value === "string" ? value : "";
}
