"use client";

import { useEffect, useState } from "react";

import StatusBadge from "@/constants/dashboard/status-badge";
import StatCard from "@/constants/dashboard/stat-card";

import { TransactionTypes } from "@/types/transaction.types";

export default function BillingPage() {
  const [transactions, setTransactions] =
    useState<TransactionTypes[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    async function loadTransactions() {
      try {
        const userRes =
          await fetch("/api/user/me");

        const userData =
          await userRes.json();

        if (
          !userData.user
            ?.activeSubscriptionId
        ) {
          return;
        }

        const txRes =
          await fetch(
            `/api/transaction?subscriptionId=${userData.user.activeSubscriptionId}`
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

    loadTransactions();
  }, []);

  const totalPaid =
    transactions.reduce(
      (sum, tx) =>
        sum + tx.amountPaid,
      0
    );

  const latestTransaction =
    transactions[0];

  const outstandingBalance =
    latestTransaction
      ?.remainingBalance || 0;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading Billing...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">
          Billing Overview
        </h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Total Paid"
            value={`₹${totalPaid}`}
          />

          <StatCard
            title="Outstanding Balance"
            value={`₹${outstandingBalance}`}
          />

          <StatCard
            title="Transactions"
            value={transactions.length}
          />
        </div>

        {/* Transactions Table */}
        <div className="rounded-2xl border bg-white shadow-sm overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold">
              Transaction History
            </h2>
          </div>

          {transactions.length === 0 ? (
            <div className="p-10 text-center text-slate-500">
              No transactions found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-100">
                  <tr>
                    <th className="text-left p-4">
                      Invoice
                    </th>

                    <th className="text-left p-4">
                      Paid
                    </th>

                    <th className="text-left p-4">
                      Total
                    </th>

                    <th className="text-left p-4">
                      Balance
                    </th>

                    <th className="text-left p-4">
                      Status
                    </th>

                    <th className="text-left p-4">
                      Date
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {transactions.map(
                    (tx) => (
                      <tr
                        key={tx._id}
                        className="border-t hover:bg-slate-50"
                      >
                        <td className="p-4 font-medium">
                          {
                            tx.invoiceNumber
                          }
                        </td>

                        <td className="p-4">
                          ₹
                          {
                            tx.amountPaid
                          }
                        </td>

                        <td className="p-4">
                          ₹
                          {
                            tx.totalAmount
                          }
                        </td>

                        <td className="p-4">
                          ₹
                          {
                            tx.remainingBalance
                          }
                        </td>

                        <td className="p-4">
                          <StatusBadge
                            status={
                              tx.paymentStatus
                            }
                          />
                        </td>

                        <td className="p-4">
                          {new Date(
                            tx.paymentDate
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
      </div>
    </main>
  );
}