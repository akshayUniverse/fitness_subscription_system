"use client";

import { useEffect, useState } from "react";

import { AdminShell } from "@/components/layout/sidebar";
import StatusBadge from "@/constants/dashboard/status-badge";

interface Subscription {
  _id: string;
  totalAmount: number;
  balanceDue: number;
  status: string;
  endDate: string;
  userId: {
    name: string;
    email: string;
  };
  planId: {
    name: string;
  };
}

export default function AdminSubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        const response = await fetch("/api/admin/subscriptions");
        const data = await response.json();

        if (!data.success) {
          throw new Error(data.message || "Failed to load subscriptions");
        }

        setSubscriptions(data.subscriptions || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load subscriptions");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  return (
    <AdminShell>
      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <p className="text-sm font-medium text-slate-500">Members</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-950">Subscriptions</h1>

        <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-5 py-4">
            <h2 className="font-semibold text-slate-950">Subscription oversight</h2>
            <p className="mt-1 text-sm text-slate-500">Track member plans, balances, and expiry dates.</p>
          </div>

          {loading ? (
            <div className="space-y-3 p-5">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="h-14 animate-pulse rounded-lg bg-slate-100" />
              ))}
            </div>
          ) : error ? (
            <div className="m-5 rounded-lg bg-red-50 p-4 text-sm text-red-700">{error}</div>
          ) : subscriptions.length === 0 ? (
            <div className="p-10 text-center">
              <h3 className="font-semibold text-slate-950">No subscriptions yet</h3>
              <p className="mt-2 text-sm text-slate-500">Subscriptions will appear when users join a plan.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-sm">
                <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-5 py-3">Member</th>
                    <th className="px-5 py-3">Plan</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3">Amount</th>
                    <th className="px-5 py-3">Balance</th>
                    <th className="px-5 py-3">End Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {subscriptions.map((subscription) => (
                    <tr key={subscription._id} className="hover:bg-slate-50">
                      <td className="px-5 py-4">
                        <p className="font-medium text-slate-950">{subscription.userId?.name || "Unknown"}</p>
                        <p className="text-xs text-slate-500">{subscription.userId?.email}</p>
                      </td>
                      <td className="px-5 py-4">{subscription.planId?.name || "-"}</td>
                      <td className="px-5 py-4">
                        <StatusBadge status={subscription.status} />
                      </td>
                      <td className="px-5 py-4">Rs {subscription.totalAmount}</td>
                      <td className="px-5 py-4">Rs {subscription.balanceDue}</td>
                      <td className="px-5 py-4 text-slate-500">
                        {new Date(subscription.endDate).toLocaleDateString()}
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
