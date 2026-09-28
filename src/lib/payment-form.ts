import type {
  PaymentFieldChange,
  PaymentFormAction,
  PaymentFormState,
} from "@/types/payment";
import type React from "react";
import {
  toPaymentCategory,
  toPaymentFrequency,
  toPaymentType,
} from "./payment-validation";
import { INIT_PAYMENT } from "@/constants/payments";
import { readString } from "@/utils/payments-helpers";

function reconcilePaymentForm(
  prev: PaymentFormState,
  patch: Partial<PaymentFormState>,
): PaymentFormState {
  const next: PaymentFormState = { ...prev, ...patch };

  if (patch.paid === false) next.paid_at = null;
  if (patch.recurrent === false) next.frequency = null;

  if (next.frequency) next.recurrent = true;
  if (next.paid_at) next.paid = true;

  return next;
}

export function toPaymentFieldChange(
  event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
): PaymentFieldChange {
  const target = event.target;
  const isCheckbox =
    target instanceof HTMLInputElement && target.type === "checkbox";

  return {
    name: target.name,
    value: target.value,
    checked: isCheckbox ? target.checked : false,
    isCheckbox,
  };
}

function fieldPatch(
  name: string,
  value: string,
  isCheckbox: boolean,
  checked: boolean,
): Partial<PaymentFormState> {
  if (name === "paid") return isCheckbox ? { paid: checked } : {};
  if (name === "recurrent") return isCheckbox ? { recurrent: checked } : {};
  if (name === "amount") return { amount: value === "" ? 0 : Number(value) };
  if (name === "type") return { type: toPaymentType(value) };
  if (name === "category") return { category: toPaymentCategory(value) };
  if (name === "frequency") return { frequency: toPaymentFrequency(value) };
  if (name === "paid_at") return { paid_at: value || null };
  if (name === "due_date") return { due_date: value || null };
  if (name === "receipt_url") return { receipt_url: value || null };
  if (name === "name") return { name: value };
  if (name === "date") return { date: value };
  return {};
}

function applyFieldChange(
  prev: PaymentFormState,
  { name, value, isCheckbox, checked }: PaymentFieldChange,
): PaymentFormState {
  return reconcilePaymentForm(
    prev,
    fieldPatch(name, value, isCheckbox, checked),
  );
}

export function paymentFormReducer(
  prev: PaymentFormState,
  action: PaymentFormAction,
): PaymentFormState {
  if (action.type === "reset") return INIT_PAYMENT;
  return applyFieldChange(prev, action.change);
}

function formDataToPaymentState(
  formData: FormData,
  base: PaymentFormState = INIT_PAYMENT,
): PaymentFormState {
  const amount = readString(formData, "amount");

  return reconcilePaymentForm(
    { ...base },
    {
      name: readString(formData, "name"),
      amount: amount === "" ? 0 : Number(amount),
      type: toPaymentType(readString(formData, "type")),
      category: toPaymentCategory(readString(formData, "category")),
      date: readString(formData, "date"),
      due_date: readString(formData, "due_date") || null,
      paid_at: readString(formData, "paid_at") || null,
      frequency: toPaymentFrequency(readString(formData, "frequency")),
      receipt_url: readString(formData, "receipt_url") || null,
      paid: formData.has("paid"),
      recurrent: formData.has("recurrent"),
    },
  );
}
