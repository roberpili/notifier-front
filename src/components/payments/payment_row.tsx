import Link from "next/link";
import type { Payment } from "@/types";
import { formatDate } from "@/lib/payments-helpers";

interface PaymentRowProps {
  payment: Payment;
}

export const PaymentRow = ({ payment }: PaymentRowProps) => {
  return (
    <tr className="payment-row">
      <td>{payment.id}</td>

      <th className="row">{payment.name}</th>

      <td>{payment.type}</td>
      <td>{payment.category}</td>
      <td>${payment.amount}</td>
      <td>{formatDate(payment.date)}</td>
      <td>{formatDate(payment.due_date)}</td>

      <td>
        <span
          className={`payment-status payment-status--${
            payment.paid ? "paid" : "unpaid"
          }`}
        >
          {payment.paid ? "Paid" : "Unpaid"}
        </span>
      </td>

      <td>{formatDate(payment.paid_at)}</td>

      <td>
        <span
          className={`payment-recurrent payment-recurrent--${
            payment.recurrent ? "yes" : "no"
          }`}
        >
          {payment.recurrent ? "Yes" : "No"}
        </span>
      </td>

      <td>{payment.frequency || "-"}</td>

      <td className="payment-row-action">
        <Link href={`/payments/${payment.id}/edit`}>Edit</Link>
      </td>

      <td className="payment-row-action">
        <Link href={`/payments/${payment.id}/delete`}>Delete</Link>
      </td>
    </tr>
  );
};
