"use client";

import { useEffect, useState } from "react";
import { Filter, MoreVertical } from "lucide-react";

import { AdminShell } from "@/components/layout/sidebar";
import StatusBadge from "@/constants/dashboard/status-badge";

interface Subscription {
  _id: string;
  totalAmount: number;
  balanceDue: number;
  paidAmount: number;
  status: string;
  endDate: string;
  userId: {
    _id: string;
    name: string;
    email: string;
  };
  planId: {
    _id: string;
    name: string;
  };
  planSnapshot?: any;
}

export default function AdminSubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [selectedUser, setSelectedUser] = useState<string>("");
  const [selectedPlan, setSelectedPlan] = useState<string>("");
  const [overridingId, setOverridingId] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState("");

  // Extract unique users and plans for filters
  const uniqueUsers = Array.from(
  new Map(
    subscriptions
      .filter((s) => s.userId)
      .map((s) => [s.userId!._id, s.userId])
  ).values()
);
  const uniquePlans = Array.from(
  new Map(
    subscriptions
      .filter((s) => s.planId)
      .map((s) => [s.planId!._id, s.planId])
  ).values()
);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
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

  // Apply filters
  let filteredSubscriptions = subscriptions.filter((sub) => {
    if (selectedStatus && sub.status !== selectedStatus) return false;
    if (selectedUser && sub.userId?._id !== selectedUser) return false;

if (selectedPlan && sub.planId?._id !== selectedPlan) return false;
    return true;
  });

  const handleAdminOverride = async (subscriptionId: string) => {
    if (!confirm("Mark this subscription as completed? This will set paid amount to total amount.")) {
      return;
    }

    setOverridingId(subscriptionId);

    try {
      const response = await fetch("/api/admin/subscriptions/override", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subscriptionId }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Override failed");
      }

      setSuccessMessage("Subscription marked as completed");
      await loadData();
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Override failed");
    } finally {
      setOverridingId("");
    }
  };

  return (
    <AdminShell>
      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <p className="text-sm font-medium text-slate-500">Members</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-950">Subscriptions</h1>

        {successMessage && (
          <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
            {successMessage}
          </div>
        )}

        {/* Filters */}
        <div className="mt-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="h-4 w-4 text-slate-600" />
            <h3 className="font-medium text-slate-950">Filters</h3>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Status
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-950"
              >
                <option value="">All Status</option>
                <option value="PENDING">Pending</option>
                <option value="ACTIVE">Active</option>
                <option value="EXPIRED">Expired</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                User
              </label>
              <select
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-950"
              >
                <option value="">All Users</option>
                {uniqueUsers.map((user) => (
                  <option key={user?._id} value={user?._id}>
                    {user.name} ({user.email})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Plan
              </label>
              <select
                value={selectedPlan}
                onChange={(e) => setSelectedPlan(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-950"
              >
                <option value="">All Plans</option>
                {uniquePlans.map((plan) => (
                  <option key={plan?._id} value={plan?._id}>
                    {plan.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-5 py-4">
            <h2 className="font-semibold text-slate-950">
              Subscription Management ({filteredSubscriptions.length})
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Track member plans, balances, and take admin actions.
            </p>
          </div>

          {loading ? (
            <div className="space-y-3 p-5">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="h-14 animate-pulse rounded-lg bg-slate-100" />
              ))}
            </div>
          ) : error ? (
            <div className="m-5 rounded-lg bg-red-50 p-4 text-sm text-red-700">{error}</div>
          ) : filteredSubscriptions.length === 0 ? (
            <div className="p-10 text-center">
              <h3 className="font-semibold text-slate-950">No subscriptions found</h3>
              <p className="mt-2 text-sm text-slate-500">
                {subscriptions.length === 0
                  ? "Subscriptions will appear when users join a plan."
                  : "No subscriptions match your filters."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-sm">
                <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-5 py-3">Member</th>
                    <th className="px-5 py-3">Plan</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3">Amount</th>
                    <th className="px-5 py-3">Paid</th>
                    <th className="px-5 py-3">Balance</th>
                    <th className="px-5 py-3">Progress</th>
                    <th className="px-5 py-3">End Date</th>
                    <th className="px-5 py-3">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredSubscriptions.map((subscription) => {
                    const progress =
                      subscription.totalAmount > 0
                        ? Math.round(
                            (subscription.paidAmount / subscription.totalAmount) * 100
                          )
                        : 0;

                    return (
                      <tr key={subscription._id} className="hover:bg-slate-50">
                        <td className="px-5 py-4">
                          <p className="font-medium text-slate-950">
                            {subscription.userId?.name || "Unknown"}
                          </p>
                          <p className="text-xs text-slate-500">
                            {subscription.userId?.email}
                          </p>
                        </td>
                        <td className="px-5 py-4">
                          {subscription.planSnapshot?.name ||
 subscription.planId?.name ||
 "Deleted Plan"}
                        </td>
                        <td className="px-5 py-4">
                          <StatusBadge status={subscription.status} />
                        </td>
                        <td className="px-5 py-4 font-medium">
                          Rs {subscription.totalAmount}
                        </td>
                        <td className="px-5 py-4">
                          <span className="text-emerald-600 font-medium">
                            Rs {subscription.paidAmount}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <span className="text-orange-600 font-medium">
                            Rs {subscription.balanceDue}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-16 rounded-full bg-slate-200">
                              <div
                                className="h-full rounded-full bg-emerald-500"
                                style={{ width: `${Math.min(progress, 100)}%` }}
                              />
                            </div>
                            <span className="text-xs text-slate-600">
                              {progress}%
                            </span>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-slate-500">
                          {new Date(subscription.endDate).toLocaleDateString()}
                        </td>
                        <td className="px-5 py-4">
                          {subscription.balanceDue > 0 &&
                            subscription.status !== "COMPLETED" && (
                              <button
                                onClick={() =>
                                  handleAdminOverride(subscription._id)
                                }
                                disabled={overridingId === subscription._id}
                                className="inline-flex items-center gap-1 rounded px-2 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50 disabled:opacity-50"
                                title="Mark as completed"
                              >
                                {overridingId === subscription._id
                                  ? "Processing..."
                                  : "Override"}
                              </button>
                            )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </AdminShell>
  );
}
