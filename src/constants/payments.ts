import type { PaymentFormState } from "@/types/payment";

export const PAYMENT_TYPES = ["income", "expense", "subscription"] as const;

export const PAYMENT_CATEGORIES = [
  "electronics",
  "entertainment",
  "education",
  "clothing",
  "work",
  "sports",
] as const;

export const PAYMENT_FREQUENCIES = [
  "daily",
  "weekly",
  "monthly",
  "yearly",
] as const;

export const INIT_PAYMENT: PaymentFormState = {
  id: 0,
  user_id: 0,
  name: "",
  amount: 0,
  type: "",
  category: "",
  date: "",
  due_date: null,
  paid: false,
  paid_at: null,
  recurrent: false,
  frequency: null,
  receipt_url: null,
};
