"use client";

import { useEffect, useState } from "react";

interface Summary {
  totalTransactions: number;
  completedPayments: number;
  partialPayments: number;
  revenue: number;
}

export default function AdminDashboardPage() {
  const [summary, setSummary] =
    useState<Summary | null>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const response = await fetch(
          "/api/analytics/summary"
        );

        const data =
          await response.json();

        setSummary(data.summary);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading) {
    return (
      <main className="p-8">
        Loading dashboard...
      </main>
    );
  }

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-8">
        Admin Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="border rounded-xl p-6 bg-white shadow-sm">
          <h2 className="text-sm text-slate-500">
            Revenue
          </h2>

          <p className="text-3xl font-bold mt-2">
            ₹{summary?.revenue ?? 0}
          </p>
        </div>

        <div className="border rounded-xl p-6 bg-white shadow-sm">
          <h2 className="text-sm text-slate-500">
            Transactions
          </h2>

          <p className="text-3xl font-bold mt-2">
            {summary?.totalTransactions ?? 0}
          </p>
        </div>

        <div className="border rounded-xl p-6 bg-white shadow-sm">
          <h2 className="text-sm text-slate-500">
            Completed Payments
          </h2>

          <p className="text-3xl font-bold mt-2">
            {summary?.completedPayments ?? 0}
          </p>
        </div>

        <div className="border rounded-xl p-6 bg-white shadow-sm">
          <h2 className="text-sm text-slate-500">
            Partial Payments
          </h2>

          <p className="text-3xl font-bold mt-2">
            {summary?.partialPayments ?? 0}
          </p>
        </div>
      </div>
    </main>
  );
}