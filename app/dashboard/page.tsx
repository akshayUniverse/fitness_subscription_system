"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CalendarDays, CreditCard, Gauge, Wallet } from "lucide-react";

import { UserShell } from "@/components/layout/navbar";
import StatusBadge from "@/constants/dashboard/status-badge";
import { SubscriptionTypes } from "@/types/subscription.types";
import { UserTypes } from "@/types/user.types";

export default function DashboardPage() {
  const [user, setUser] = useState<UserTypes | null>(null);
  const [subscription, setSubscription] = useState<SubscriptionTypes | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      try {
        const userRes = await fetch("/api/user/me");
        const userData = await userRes.json();

        if (!userData.success) {
          throw new Error(userData.message || "Failed to load user");
        }

        setUser(userData.user);

        if (userData.user?.activeSubscriptionId) {
          const subRes = await fetch(`/api/subscription/${userData.user.activeSubscriptionId}`);
          const subData = await subRes.json();

          if (subData.success) {
            setSubscription(subData.subscription);
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  const progress =
    subscription && subscription.totalAmount > 0
      ? Math.min((subscription.paidAmount / subscription.totalAmount) * 100, 100)
      : 0;

  return (
    <UserShell>
      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm font-medium text-slate-500">Welcome back</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-950">
            {user?.name || "Member Dashboard"}
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Review your current plan, payment progress, and upcoming subscription dates.
          </p>
        </div>

        {loading ? (
          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="h-32 animate-pulse rounded-xl border border-slate-200 bg-white" />
            ))}
          </div>
        ) : error ? (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>
        ) : !subscription ? (
          <div className="mt-6 rounded-xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <h2 className="text-lg font-semibold text-slate-950">No active subscription</h2>
            <p className="mt-2 text-sm text-slate-500">Your subscription details will appear after you join a plan.</p>
          </div>
        ) : (
          <>
            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
              <InfoCard icon={<CreditCard className="size-5" />} label="Current Plan" value={subscription.planSnapshot?.name || "No Plan"} />
              <InfoCard icon={<Wallet className="size-5" />} label="Amount Paid" value={`Rs ${subscription.paidAmount || 0}`} />
              <InfoCard icon={<Gauge className="size-5" />} label="Balance Due" value={`Rs ${subscription.balanceDue || 0}`} />
              <InfoCard icon={<CalendarDays className="size-5" />} label="Status" value={<StatusBadge status={subscription.status || "UNKNOWN"} />} />
            </div>

            <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 className="font-semibold text-slate-950">Payment Progress</h2>
                    <p className="mt-1 text-sm text-slate-500">
                      Rs {subscription.paidAmount} paid of Rs {subscription.totalAmount}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-slate-950">{Math.round(progress)}%</p>
                </div>

                <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full rounded-full bg-emerald-500" style={{ width: `${progress}%` }} />
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="font-semibold text-slate-950">Subscription Dates</h2>
                <dl className="mt-4 space-y-4 text-sm">
                  <DateRow label="Start" value={subscription.startDate} />
                  <DateRow label="End" value={subscription.endDate} />
                  <div className="flex justify-between gap-4">
                    <dt className="text-slate-500">Payment Type</dt>
                    <dd className="font-medium text-slate-950">{subscription.paymentType || "-"}</dd>
                  </div>
                </dl>
              </div>
            </div>

            <Link
              href="/billing"
              className="mt-6 inline-flex rounded-lg bg-slate-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
            >
              View billing history
            </Link>
          </>
        )}
      </section>
    </UserShell>
  );
}

function InfoCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm font-medium text-slate-500">{label}</p>
        <div className="rounded-lg bg-slate-100 p-2 text-slate-600">{icon}</div>
      </div>
      <div className="mt-4 text-2xl font-semibold tracking-tight text-slate-950">{value}</div>
    </div>
  );
}

function DateRow({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-slate-500">{label}</dt>
      <dd className="font-medium text-slate-950">
        {value ? new Date(value).toLocaleDateString() : "-"}
      </dd>
    </div>
  );
}
