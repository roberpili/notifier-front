import type { Payment } from "@/types/payment";
import { PaymentRow } from "./payment_row";
import "@/app/styles/payments-table.css";

interface TableProps {
  payments: Payment[];
}

export const PaymentsTableComponent = ({ payments }: TableProps) => {
  return (
    <div className="payments-table-container">
      <table className="payments-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Type</th>
            <th>Category</th>
            <th>Amount</th>
            <th>Date</th>
            <th>Due Date</th>
            <th>Status</th>
            <th>Paid At</th>
            <th>Recurrent</th>
            <th>Frequency</th>
            <th>
              <span className="sr-only">Edit</span>
            </th>
            <th>
              <span className="sr-only">Delete</span>
            </th>
          </tr>
        </thead>

        <tbody>
          {payments.length === 0 ? (
            <tr>
              <td colSpan={13} className="payments-table-empty">
                No payments found
              </td>
            </tr>
          ) : (
            payments.map((payment: Payment) => (
              <PaymentRow key={payment.id} payment={payment} />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
