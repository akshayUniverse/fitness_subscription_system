"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Filter } from "lucide-react";

import { UserShell } from "@/components/layout/navbar";
import StatusBadge from "@/constants/dashboard/status-badge";
import { TransactionTypes } from "@/types/transaction.types";

export default function BillingPage() {
  const [transactions, setTransactions] = useState<TransactionTypes[]>([]);
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userId, setUserId] = useState<string>("");

  // Filters
  const [selectedSubscription, setSelectedSubscription] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("date-desc");

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);

        const userRes = await fetch("/api/user/me");
        const userData = await userRes.json();

        if (!userData.success) {
          throw new Error(userData.message || "Failed to load user");
        }

        const userId = userData.user?.userId || userData.user?._id;
        setUserId(userId);

        const [txRes, subRes] = await Promise.all([
          fetch(`/api/user/transactions?userId=${userId}`),
          fetch(`/api/user/subscriptions?userId=${userId}`),
        ]);

        const txData = await txRes.json();
        const subData = await subRes.json();

        if (txData.success) {
          setTransactions(txData.transactions || []);
        }

        if (subData.success) {
          setSubscriptions(subData.subscriptions || []);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load billing");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // Filter transactions
  let filteredTransactions = [...transactions];

  if (selectedSubscription) {
    filteredTransactions = filteredTransactions.filter(
      (tx) => tx.subscriptionId?._id === selectedSubscription
    );
  }

  if (selectedStatus) {
    filteredTransactions = filteredTransactions.filter(
      (tx) => tx.paymentStatus === selectedStatus
    );
  }

  // Sort transactions
  if (sortBy === "date-desc") {
    filteredTransactions.sort(
      (a, b) =>
        new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime()
    );
  } else if (sortBy === "date-asc") {
    filteredTransactions.sort(
      (a, b) =>
        new Date(a.paymentDate).getTime() - new Date(b.paymentDate).getTime()
    );
  } else if (sortBy === "amount-desc") {
    filteredTransactions.sort((a, b) => b.amountPaid - a.amountPaid);
  } else if (sortBy === "amount-asc") {
    filteredTransactions.sort((a, b) => a.amountPaid - b.amountPaid);
  }

  const totalPaid = filteredTransactions.reduce((sum, tx) => sum + tx.amountPaid, 0);
  const outstandingBalance = transactions.length > 0 ? transactions[transactions.length - 1]?.remainingBalance || 0 : 0;

  return (
    <UserShell>
      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-medium text-slate-500">Billing</p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-950">
              Transaction History
            </h1>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          <SummaryCard label="Total Paid" value={`Rs ${totalPaid.toFixed(2)}`} />
          <SummaryCard label="Outstanding Balance" value={`Rs ${outstandingBalance.toFixed(2)}`} />
          <SummaryCard label="Transactions" value={filteredTransactions.length} />
        </div>

        {/* Filters */}
        <div className="mt-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="h-4 w-4 text-slate-600" />
            <h3 className="font-medium text-slate-950">Filters</h3>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Subscription
              </label>
              <select
                value={selectedSubscription}
                onChange={(e) => setSelectedSubscription(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-950 focus:border-slate-950 focus:outline-none"
              >
                <option value="">All Subscriptions</option>
                {subscriptions.map((sub) => (
                  <option key={sub._id} value={sub._id}>
                    {sub.planSnapshot?.name || "Subscription"} ({sub.status})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Payment Status
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-950 focus:border-slate-950 focus:outline-none"
              >
                <option value="">All Status</option>
                <option value="PARTIAL">Partial</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-950 focus:border-slate-950 focus:outline-none"
              >
                <option value="date-desc">Date (Newest)</option>
                <option value="date-asc">Date (Oldest)</option>
                <option value="amount-desc">Amount (High to Low)</option>
                <option value="amount-asc">Amount (Low to High)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-5 py-4">
            <h2 className="font-semibold text-slate-950">Invoices</h2>
            <p className="mt-1 text-sm text-slate-500">All your payment records.</p>
          </div>

          {loading ? (
            <div className="space-y-3 p-5">
              {[1, 2, 3].map((item) => (
                <div key={item} className="h-14 animate-pulse rounded-lg bg-slate-100" />
              ))}
            </div>
          ) : error ? (
            <div className="m-5 rounded-lg bg-red-50 p-4 text-sm text-red-700">{error}</div>
          ) : filteredTransactions.length === 0 ? (
            <div className="p-10 text-center">
              <h3 className="font-semibold text-slate-950">No transactions found</h3>
              <p className="mt-2 text-sm text-slate-500">
                {transactions.length === 0
                  ? "Your invoices will appear here once payments are recorded."
                  : "No transactions match your filters."}
              </p>
              {transactions.length === 0 && (
                <Link
                  href="/plans"
                  className="mt-4 inline-flex rounded-lg bg-slate-950 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
                >
                  Browse Plans
                </Link>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-sm">
                <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-5 py-3">Invoice</th>
                    <th className="px-5 py-3">Plan</th>
                    <th className="px-5 py-3">Amount Paid</th>
                    <th className="px-5 py-3">Remaining Balance</th>
                    <th className="px-5 py-3">Payment Status</th>
                    <th className="px-5 py-3">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredTransactions.map((tx) => (
                    <tr key={tx._id} className="hover:bg-slate-50">
                      <td className="px-5 py-4 font-medium text-slate-950">
                        {tx.invoiceNumber}
                      </td>
                      <td className="px-5 py-4">
                        <Link
                          href={`/subscriptions/${tx.subscriptionId?._id}`}
                          className="text-slate-600 hover:text-slate-950 hover:underline"
                        >
                          {tx.subscriptionId?.planSnapshot?.name || "Unknown"}
                        </Link>
                      </td>
                      <td className="px-5 py-4">Rs {tx.amountPaid.toFixed(2)}</td>
                      <td className="px-5 py-4">Rs {tx.remainingBalance.toFixed(2)}</td>
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