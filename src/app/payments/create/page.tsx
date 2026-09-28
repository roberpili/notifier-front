import type { Metadata } from "next";
import { CreatePaymentComponent } from "@/components/payments/create_payments";

export const metadata: Metadata = {
  title: "Notifier | Create payment",
};

export default function CreatePaymentPage() {
  return <CreatePaymentComponent />;
}
