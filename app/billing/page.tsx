"use client";

import { useEffect, useState } from "react";

import { UserShell } from "@/components/layout/navbar";
import StatusBadge from "@/constants/dashboard/status-badge";
import { TransactionTypes } from "@/types/transaction.types";

export default function BillingPage() {
  const [transactions, setTransactions] = useState<TransactionTypes[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadTransactions() {
      try {
        const userRes = await fetch("/api/user/me");
        const userData = await userRes.json();

        if (!userData.success) {
          throw new Error(userData.message || "Failed to load user");
        }

        if (!userData.user?.activeSubscriptionId) {
          return;
        }

        const txRes = await fetch(`/api/transaction?subscriptionId=${userData.user.activeSubscriptionId}`);
        const txData = await txRes.json();

        if (!txData.success) {
          throw new Error(txData.message || "Failed to load transactions");
        }

        setTransactions(txData.transactions || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load billing");
      } finally {
        setLoading(false);
      }
    }

    loadTransactions();
  }, []);

  const totalPaid = transactions.reduce((sum, tx) => sum + tx.amountPaid, 0);
  const outstandingBalance = transactions[0]?.remainingBalance || 0;

  return (
    <UserShell>
      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-medium text-slate-500">Billing</p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-950">Transaction History</h1>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          <SummaryCard label="Total Paid" value={`Rs ${totalPaid}`} />
          <SummaryCard label="Outstanding Balance" value={`Rs ${outstandingBalance}`} />
          <SummaryCard label="Transactions" value={transactions.length} />
        </div>

        <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-5 py-4">
            <h2 className="font-semibold text-slate-950">Invoices</h2>
            <p className="mt-1 text-sm text-slate-500">Payment records for your active subscription.</p>
          </div>

          {loading ? (
            <div className="space-y-3 p-5">
              {[1, 2, 3].map((item) => (
                <div key={item} className="h-14 animate-pulse rounded-lg bg-slate-100" />
              ))}
            </div>
          ) : error ? (
            <div className="m-5 rounded-lg bg-red-50 p-4 text-sm text-red-700">{error}</div>
          ) : transactions.length === 0 ? (
            <div className="p-10 text-center">
              <h3 className="font-semibold text-slate-950">No transactions found</h3>
              <p className="mt-2 text-sm text-slate-500">Your invoices will appear here once payments are recorded.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-sm">
                <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-5 py-3">Invoice</th>
                    <th className="px-5 py-3">Amount Paid</th>
                    <th className="px-5 py-3">Total Amount</th>
                    <th className="px-5 py-3">Remaining Balance</th>
                    <th className="px-5 py-3">Payment Status</th>
                    <th className="px-5 py-3">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {transactions.map((tx) => (
                    <tr key={tx._id} className="hover:bg-slate-50">
                      <td className="px-5 py-4 font-medium text-slate-950">{tx.invoiceNumber}</td>
                      <td className="px-5 py-4">Rs {tx.amountPaid}</td>
                      <td className="px-5 py-4">Rs {tx.totalAmount}</td>
                      <td className="px-5 py-4">Rs {tx.remainingBalance}</td>
                      <td className="px-5 py-4">
                        <StatusBadge status={tx.paymentStatus} />
                      </td>
                      <td className="px-5 py-4 text-slate-500">
                        {new Date(tx.paymentDate).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </UserShell>
  );
}

function SummaryCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">{value}</p>
    </div>
  );
}
