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

export default function BillingPage() {
  const [transactions, setTransactions] =
    useState<Transaction[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    async function loadBilling() {
      try {
        const userRes =
          await fetch("/api/user/me");

        const userData =
          await userRes.json();

        const subscriptionId =
          userData.user
            ?.activeSubscriptionId;

        if (!subscriptionId) {
          return;
        }

        const txRes =
          await fetch(
            `/api/transaction?subscriptionId=${subscriptionId}`
          );

        const txData =
          await txRes.json();

        setTransactions(
          txData.transactions || []
        );
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadBilling();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading Billing...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-5xl mx-auto bg-white rounded-3xl border p-8 shadow-sm">

        <h1 className="text-3xl font-semibold mb-6">
          Billing History
        </h1>

        {transactions.length === 0 ? (
          <p className="text-slate-600">
            No transactions found.
          </p>
        ) : (
          <div className="overflow-x-auto">

            <table className="w-full border-collapse">

              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">
                    Invoice
                  </th>

                  <th className="text-left p-3">
                    Paid
                  </th>

                  <th className="text-left p-3">
                    Total
                  </th>

                  <th className="text-left p-3">
                    Balance
                  </th>

                  <th className="text-left p-3">
                    Status
                  </th>

                  <th className="text-left p-3">
                    Date
                  </th>
                </tr>
              </thead>

              <tbody>
                {transactions.map(
                  (transaction) => (
                    <tr
                      key={transaction._id}
                      className="border-b"
                    >
                      <td className="p-3">
                        {
                          transaction.invoiceNumber
                        }
                      </td>

                      <td className="p-3">
                        ₹
                        {
                          transaction.amountPaid
                        }
                      </td>

                      <td className="p-3">
                        ₹
                        {
                          transaction.totalAmount
                        }
                      </td>

                      <td className="p-3">
                        ₹
                        {
                          transaction.remainingBalance
                        }
                      </td>

                      <td className="p-3">
                        {
                          transaction.paymentStatus
                        }
                      </td>

                      <td className="p-3">
                        {new Date(
                          transaction.paymentDate
                        ).toLocaleDateString()}
                      </td>
                    </tr>
                  )
                )}
              </tbody>

            </table>

          </div>
        )}
      </div>
    </main>
  );
}