import type { CreatePaymentDTO, Payment } from "@/types/payment";

export const API_BASE_URL = "http://localhost:8080";

async function parseError(response: Response): Promise<string> {
  try {
    const data: unknown = await response.json();

    if (data && typeof data === "object") {
      const message = (data as Record<string, unknown>).message;
      if (typeof message === "string" && message) return message;
    }

    return JSON.stringify(data);
  } catch {
    return (await response.text()) || `HTTP Error: ${response.status}`;
  }
}

export async function createPayment(
  paymentData: CreatePaymentDTO,
  token: string,
): Promise<Payment> {
  const response = await fetch(`${API_BASE_URL}/v1/auth/payments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(paymentData),
  });

  if (!response.ok) {
    const errorMessage = await parseError(response);
    throw new Error(errorMessage);
  }

  return response.json();
}

export async function getPayments(token: string): Promise<Payment[]> {
  const response = await fetch(`${API_BASE_URL}/v1/auth/payments/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const errorMessage = await parseError(response);
    throw new Error(errorMessage);
  }

  return response.json();
}

export async function getPaymentById(
  id: number,
  token: string,
): Promise<Payment> {
  const response = await fetch(`${API_BASE_URL}/v1/auth/payments/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const errorMessage = await parseError(response);
    throw new Error(errorMessage);
  }

  return response.json();
}

export async function updatePayment(
  id: number,
  paymentData: CreatePaymentDTO,
  token: string,
): Promise<Payment> {
  const response = await fetch(`${API_BASE_URL}/v1/auth/payments/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(paymentData),
  });

  if (!response.ok) {
    const errorMessage = await parseError(response);
    throw new Error(errorMessage);
  }

  return response.json();
}

export async function deletePayment(id: number, token: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/v1/auth/payments/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorMessage = await parseError(response);
    throw new Error(errorMessage);
  }
}
