"use client";

import { useEffect, useState } from "react";

import { AdminShell } from "@/components/layout/sidebar";
import StatusBadge from "@/constants/dashboard/status-badge";

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
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function init() {
      try {
        const response = await fetch("/api/analytics/transactions");
        const data = await response.json();

        if (!data.success) {
          throw new Error(data.message || "Failed to load transactions");
        }

        setTransactions(data.transactions || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load transactions");
      } finally {
        setLoading(false);
      }
    }

    init();
  }, []);

  return (
    <AdminShell>
      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <p className="text-sm font-medium text-slate-500">Payments</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-950">Transactions</h1>

        <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-5 py-4">
            <h2 className="font-semibold text-slate-950">Recent transactions</h2>
            <p className="mt-1 text-sm text-slate-500">Latest invoices and payment status.</p>
          </div>

          {loading ? (
            <div className="space-y-3 p-5">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="h-14 animate-pulse rounded-lg bg-slate-100" />
              ))}
            </div>
          ) : error ? (
            <div className="m-5 rounded-lg bg-red-50 p-4 text-sm text-red-700">{error}</div>
          ) : transactions.length === 0 ? (
            <div className="p-10 text-center">
              <h3 className="font-semibold text-slate-950">No transactions yet</h3>
              <p className="mt-2 text-sm text-slate-500">Transactions will appear after payments are recorded.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-sm">
                <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-5 py-3">Invoice</th>
                    <th className="px-5 py-3">Paid</th>
                    <th className="px-5 py-3">Total</th>
                    <th className="px-5 py-3">Balance</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {transactions.map((transaction) => (
                    <tr key={transaction._id} className="hover:bg-slate-50">
                      <td className="px-5 py-4 font-medium text-slate-950">{transaction.invoiceNumber}</td>
                      <td className="px-5 py-4">Rs {transaction.amountPaid}</td>
                      <td className="px-5 py-4">Rs {transaction.totalAmount}</td>
                      <td className="px-5 py-4">Rs {transaction.remainingBalance}</td>
                      <td className="px-5 py-4">
                        <StatusBadge status={transaction.paymentStatus} />
                      </td>
                      <td className="px-5 py-4 text-slate-500">
                        {new Date(transaction.paymentDate).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </AdminShell>
  );
}
