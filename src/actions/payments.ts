"use server";

import { formDataToPaymentState } from "@/lib/payment-form";
import { buildPaymentDTO, validatePayment } from "@/lib/payment-validation";
import {
  createPayment,
  deletePayment,
  updatePayment,
} from "@/services/payment";
import type { PaymentResultState } from "@/types/auth";
import { requireSession } from "@/utils/session";
import { revalidatePath } from "next/cache";

const failure = (message: string): PaymentResultState => ({
  message,
  type: "error",
});

const errorMessage = (error: unknown, fallback: string): string =>
  error instanceof Error ? error.message : fallback;

export async function createPaymentAction(
  _prev: PaymentResultState | null,
  formData: FormData,
): Promise<PaymentResultState> {
  const validation = validatePayment(formDataToPaymentState(formData));
  if (!validation.ok) {
    return failure(validation.error);
  }

  const session = await requireSession();

  try {
    await createPayment(buildPaymentDTO(validation.value), session.token);
  } catch (error) {
    return failure(`Error: ${errorMessage(error, "an error occurred")}`);
  }

  revalidatePath("/dashboard");

  return { message: "payment created successfully", type: "success" };
}

export async function updatePaymentAction(
  paymentId: number,
  _prev: PaymentResultState | null,
  formData: FormData,
): Promise<PaymentResultState> {
  const validation = validatePayment(formDataToPaymentState(formData));
  if (!validation.ok) {
    return failure(validation.error);
  }

  const session = await requireSession();

  try {
    await updatePayment(
      paymentId,
      buildPaymentDTO(validation.value),
      session.token,
    );
  } catch (error) {
    return failure(
      `Error: ${errorMessage(error, "An unexpected error occurred")}`,
    );
  }

  revalidatePath("/dashboard");

  return { message: "Payment updated successfully", type: "success" };
}

export async function deletePaymentAction(
  paymentId: number,
  _prev: PaymentResultState | null,
  _formData: FormData,
): Promise<PaymentResultState> {
  const session = await requireSession();

  try {
    await deletePayment(paymentId, session.token);
  } catch (error) {
    return failure(`Error: ${errorMessage(error, "an error occurred")}`);
  }

  revalidatePath("/dashboard");

  return { message: "Payment deleted successfully", type: "success" };
}
