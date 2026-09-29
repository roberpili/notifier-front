import type { Payment } from "@/types/payment";
import { AddPaymentComponent } from "./payments/add_payment";
import { PaymentsTableComponent } from "./payments/payments_table";

interface DashboardProps {
  payments: Payment[];
  error: string | null;
}

export const DashboardComponent = ({ payments, error }: DashboardProps) => {
  if (error) return <p>{error}...</p>;

  return (
    <>
      <AddPaymentComponent />
      <PaymentsTableComponent payments={payments} />
    </>
  );
};
