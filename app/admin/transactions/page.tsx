"use client";

import { useEffect, useState } from "react";
import { Filter, Download } from "lucide-react";

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
  userId?: { name: string; email: string };
  subscriptionId?: {
    _id: string;
    planSnapshot?: { name: string };
    planId?: { name: string };
  };
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filters
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");
  const [pendingRevenue, setPendingRevenue] = useState(0);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);

      let url = "/api/admin/transactions";
      const params = new URLSearchParams();

      if (selectedStatus) params.append("status", selectedStatus);
      if (dateFrom) params.append("dateFrom", dateFrom);
      if (dateTo) params.append("dateTo", dateTo);

      if (params.toString()) {
        url += "?" + params.toString();
      }

      const response = await fetch(url);
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Failed to load transactions");
      }
      const metricsRes = await fetch(
  "/api/analytics/dashboard"
);

const metricsData = await metricsRes.json();

if (metricsData.success) {
  setPendingRevenue(
    metricsData.metrics.pendingRevenue
  );
}

      setTransactions(data.transactions || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load transactions");
    } finally {
      setLoading(false);
    }
  }

  const handleFilterChange = () => {
    loadData();
  };

  const totalAmountPaid = transactions.reduce((sum, tx) => sum + tx.amountPaid, 0);
  

  return (
    <AdminShell>
      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-slate-500">Payments</p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-950">
              Transactions
            </h1>
          </div>
          <button className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
            <Download className="h-4 w-4" />
            Export
          </button>
        </div>

        {/* Summary Cards */}
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          <SummaryCard
            label="Total Transactions"
            value={transactions.length}
          />
          <SummaryCard
            label="Total Collected"
            value={`Rs ${totalAmountPaid.toFixed(2)}`}
          />
          <SummaryCard
            label="Pending Revenue"
            value={`Rs ${pendingRevenue.toFixed(2)}`}
          />
        </div>

        {/* Filters */}
        <div className="mt-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="h-4 w-4 text-slate-600" />
            <h3 className="font-medium text-slate-950">Filters</h3>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Payment Status
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-950"
              >
                <option value="">All Status</option>
                <option value="PARTIAL">Partial</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Date From
              </label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-950"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Date To
              </label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-950"
              />
            </div>

            <div className="flex items-end gap-2">
              <button
                onClick={handleFilterChange}
                className="flex-1 rounded-lg bg-slate-950 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
              >
                Apply
              </button>
              <button
                onClick={() => {
                  setSelectedStatus("");
                  setDateFrom("");
                  setDateTo("");
                }}
                className="flex-1 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-5 py-4">
            <h2 className="font-semibold text-slate-950">
              Transaction Records ({transactions.length})
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              All payment transactions with user and plan details.
            </p>
          </div>

          {loading ? (
            <div className="space-y-3 p-5">
              {[1, 2, 3, 4, 5].map((item) => (
                <div key={item} className="h-14 animate-pulse rounded-lg bg-slate-100" />
              ))}
            </div>
          ) : error ? (
            <div className="m-5 rounded-lg bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          ) : transactions.length === 0 ? (
            <div className="p-10 text-center">
              <h3 className="font-semibold text-slate-950">No transactions found</h3>
              <p className="mt-2 text-sm text-slate-500">
                {transactions.length === 0
                  ? "Transactions will appear when users make payments."
                  : "No transactions match your filters."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1000px] text-sm">
                <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-5 py-3">Invoice</th>
                    <th className="px-5 py-3">User</th>
                    <th className="px-5 py-3">Plan</th>
                    <th className="px-5 py-3">Amount Paid</th>
                    <th className="px-5 py-3">Total Amount</th>
                    <th className="px-5 py-3">Remaining Balance</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {transactions.map((tx) => (
                    <tr key={tx._id} className="hover:bg-slate-50">
                      <td className="px-5 py-4 font-mono font-medium text-slate-950">
                        {tx.invoiceNumber}
                      </td>
                      <td className="px-5 py-4">
                        <p className="font-medium text-slate-950">
                          {tx.userId?.name || "Unknown"}
                        </p>
                        <p className="text-xs text-slate-500">
                          {tx.userId?.email}
                        </p>
                      </td>
                      <td className="px-5 py-4">
                        {tx.subscriptionId?.planSnapshot?.name ||
                          tx.subscriptionId?.planId?.name ||
                          "-"}
                      </td>
                      <td className="px-5 py-4">
                        <span className="font-medium text-emerald-600">
                          Rs {tx.amountPaid.toFixed(2)}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        Rs {tx.totalAmount.toFixed(2)}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={
                            tx.remainingBalance === 0
                              ? "font-medium text-slate-600"
                              : "font-medium text-orange-600"
                          }
                        >
                          Rs {tx.remainingBalance.toFixed(2)}
                        </span>
                      </td>
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
    </AdminShell>
  );
}

function SummaryCard({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">
        {value}
      </p>
    </div>
  );
}
