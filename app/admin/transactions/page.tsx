"use client";

import { useEffect, useState } from "react";

interface Transaction {
  _id: string;
  invoiceNumber: string;
  amountPaid: number;
  totalAmount: number;
  remainingBalance: number;
  paymentStatus: string;
  paymentDate: string;
}

export default function TransactionsPage() {
  const [transactions, setTransactions] =
    useState<Transaction[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    async function init() {
      const response = await fetch(
        "/api/analytics/transactions"
      );

      const data =
        await response.json();

      setTransactions(
        data.transactions || []
      );

      setLoading(false);
    }

    init();
  }, []);

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-8">
        Transactions
      </h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="space-y-4">
          {transactions.map(
            (transaction) => (
              <div
                key={transaction._id}
                className="border rounded-xl p-4"
              >
                <h2 className="font-bold">
                  {
                    transaction.invoiceNumber
                  }
                </h2>

                <p>
                  Paid: ₹
                  {
                    transaction.amountPaid
                  }
                </p>

                <p>
                  Total: ₹
                  {
                    transaction.totalAmount
                  }
                </p>

                <p>
                  Remaining: ₹
                  {
                    transaction.remainingBalance
                  }
                </p>

                <p>
                  Status:
                  {
                    transaction.paymentStatus
                  }
                </p>

                <p>
                  Date:
                  {new Date(
                    transaction.paymentDate
                  ).toLocaleDateString()}
                </p>
              </div>
            )
          )}
        </div>
      )}
    </main>
  );
}