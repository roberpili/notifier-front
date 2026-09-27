import Link from "next/link";

export const AddPaymentComponent = () => {
  return (
    <div className="add-payment">
      <Link href="/payments/create" className="add-payment-link">
        Add Payment
      </Link>
    </div>
  );
};
