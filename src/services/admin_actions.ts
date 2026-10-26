import type { AdminUser } from "@/types/admin";
import type { Payment } from "@/types/payment";
import { adminRequest } from "./admin";

export function getAllUsers(): Promise<AdminUser[]> {
  return adminRequest<AdminUser[]>("/v1/admin/users");
}

export function getUserByEmail(email: string): Promise<AdminUser> {
  return adminRequest<AdminUser>(
    `/v1/admin/users/by-email?email=${encodeURIComponent(email)}`,
  );
}

export function getUserById(id: number): Promise<AdminUser> {
  return adminRequest<AdminUser>(`/v1/admin/users/${id}`);
}

export async function deleteUser(id: number): Promise<void> {
  await adminRequest<void>(`/v1/admin/users/${id}`, {
    method: "DELETE",
  });
}

export function getAllPayments(): Promise<Payment[]> {
  return adminRequest<Payment[]>("/v1/admin/payments");
}

export function getPaymentById(id: number): Promise<Payment> {
  return adminRequest<Payment>(`/v1/admin/payments/${id}`);
}
