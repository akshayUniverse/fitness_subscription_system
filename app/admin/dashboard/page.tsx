"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CreditCard, Receipt, Tags, Users } from "lucide-react";

import { AdminShell } from "@/components/layout/sidebar";

interface DashboardStats {
  totalUsers: number;
  totalSubscriptions: number;
  activeSubscriptions: number;
  totalRevenue: number;
}

interface Summary {
  totalTransactions: number;
}

const quickLinks = [
  {
    href: "/admin/plans",
    title: "Manage Plans",
    description: "Create, edit, and retire subscription plans.",
    icon: CreditCard,
  },
  {
    href: "/admin/coupons",
    title: "Manage Coupons",
    description: "Control discounts and expiry dates.",
    icon: Tags,
  },
  {
    href: "/admin/transactions",
    title: "View Transactions",
    description: "Review recent invoices and payment status.",
    icon: Receipt,
  },
];

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        const [dashboardRes, summaryRes] = await Promise.all([
          fetch("/api/dashboard"),
          fetch("/api/analytics/summary"),
        ]);

        const dashboardData = await dashboardRes.json();
        const summaryData = await summaryRes.json();

        if (!dashboardData.success || !summaryData.success) {
          throw new Error("Failed to load admin metrics");
        }

        setStats(dashboardData.stats);
        setSummary(summaryData.summary);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  return (
    <AdminShell>
      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-medium text-slate-500">Overview</p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-950">
              Admin Dashboard
            </h1>
          </div>

          <Link
            href="/admin/plans"
            className="inline-flex w-fit items-center justify-center rounded-lg bg-slate-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            New plan
          </Link>
        </div>

        {loading ? (
          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            {["Users", "Revenue", "Subscriptions", "Transactions"].map((item) => (
              <div key={item} className="h-32 animate-pulse rounded-xl border border-slate-200 bg-white" />
            ))}
          </div>
        ) : error ? (
          <div className="mt-8 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            <MetricCard label="Total Users" value={stats?.totalUsers ?? 0} icon={<Users className="size-5" />} />
            <MetricCard label="Total Revenue" value={`Rs ${stats?.totalRevenue ?? 0}`} icon={<CreditCard className="size-5" />} />
            <MetricCard label="Active Subscriptions" value={stats?.activeSubscriptions ?? 0} icon={<Tags className="size-5" />} />
            <MetricCard label="Total Transactions" value={summary?.totalTransactions ?? 0} icon={<Receipt className="size-5" />} />
          </div>
        )}

        <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-3">
          {quickLinks.map((link) => {
            const Icon = link.icon;

            return (
              <Link
                key={link.href}
                href={link.href}
                className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
              >
                <div className="flex size-10 items-center justify-center rounded-lg bg-slate-100 text-slate-700 group-hover:bg-slate-950 group-hover:text-white">
                  <Icon className="size-5" />
                </div>
                <h2 className="mt-4 font-semibold text-slate-950">{link.title}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-500">{link.description}</p>
              </Link>
            );
          })}
        </div>
      </section>
    </AdminShell>
  );
}

function MetricCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm font-medium text-slate-500">{label}</p>
        <div className="rounded-lg bg-slate-100 p-2 text-slate-600">{icon}</div>
      </div>
      <p className="mt-4 text-3xl font-semibold tracking-tight text-slate-950">{value}</p>
    </div>
  );
}
