"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CreditCard, Receipt, Tags, Users, TrendingUp, AlertCircle } from "lucide-react";

import { AdminShell } from "@/components/layout/sidebar";

interface DashboardMetrics {
  users: number;
  subscriptions: number;
  activeSubscriptions: number;
  pendingSubscriptions: number;
  expiredSubscriptions: number;
  completedSubscriptions: number;
  totalRevenue: number;
  pendingRevenue: number;
}

const quickLinks = [
  {
    href: "/admin/subscriptions",
    title: "Manage Subscriptions",
    description: "View and manage all user subscriptions with filtering.",
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
    description: "Review invoices, payments, and transaction history.",
    icon: Receipt,
  },
];

export default function AdminDashboardPage() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("/api/analytics/dashboard");

        const data = await res.json();

        if (!data.success) {
          throw new Error(data.message || "Failed to load metrics");
        }

        setMetrics(data.metrics);
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
            <p className="mt-1 text-sm text-slate-600">
              System-wide metrics and management tools
            </p>
          </div>

          <Link
            href="/admin/plans"
            className="inline-flex w-fit items-center justify-center rounded-lg bg-slate-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            New plan
          </Link>
        </div>

        {loading ? (
          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="h-32 animate-pulse rounded-xl border border-slate-200 bg-white" />
            ))}
          </div>
        ) : error ? (
          <div className="mt-8 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        ) : metrics ? (
          <>
            {/* Key Metrics */}
            <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              <MetricCard 
                label="Total Users" 
                value={metrics.users} 
                icon={<Users className="size-5" />} 
                color="blue"
              />
              <MetricCard 
                label="Total Subscriptions" 
                value={metrics.subscriptions} 
                icon={<CreditCard className="size-5" />} 
                color="purple"
              />
              <MetricCard 
                label="Active Subscriptions" 
                value={metrics.activeSubscriptions} 
                icon={<TrendingUp className="size-5" />} 
                color="emerald"
              />
              <MetricCard 
                label="Pending Subscriptions" 
                value={metrics.pendingSubscriptions} 
                icon={<AlertCircle className="size-5" />} 
                color="amber"
              />
            </div>

            {/* Revenue and Status Section */}
            <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="font-semibold text-slate-950">Revenue Overview</h2>
                <div className="mt-6 space-y-4">
                  <div>
                    <p className="text-sm text-slate-600">Total Revenue Collected</p>
                    <p className="mt-2 text-3xl font-semibold text-emerald-600">
                      Rs {metrics.totalRevenue.toFixed(2)}
                    </p>
                  </div>
                  <div className="border-t border-slate-200 pt-4">
                    <p className="text-sm text-slate-600">Pending Revenue (Not Yet Collected)</p>
                    <p className="mt-2 text-2xl font-semibold text-orange-600">
                      Rs {metrics.pendingRevenue.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="font-semibold text-slate-950">Subscription Status Breakdown</h2>
                <div className="mt-6 space-y-3 text-sm">
                  <StatusRow 
                    label="Active" 
                    value={metrics.activeSubscriptions} 
                    color="emerald"
                  />
                  <StatusRow 
                    label="Pending" 
                    value={metrics.pendingSubscriptions} 
                    color="amber"
                  />
                  <StatusRow 
                    label="Expired" 
                    value={metrics.expiredSubscriptions} 
                    color="red"
                  />
                  <StatusRow 
                    label="Completed" 
                    value={metrics.completedSubscriptions} 
                    color="slate"
                  />
                </div>
              </div>
            </div>

            {/* Quick Links */}
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
          </>
        ) : null}
      </section>
    </AdminShell>
  );
}

function MetricCard({
  label,
  value,
  icon,
  color,
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color: "blue" | "purple" | "emerald" | "amber";
}) {
  const colorClasses = {
    blue: "bg-blue-100 text-blue-600",
    purple: "bg-purple-100 text-purple-600",
    emerald: "bg-emerald-100 text-emerald-600",
    amber: "bg-amber-100 text-amber-600",
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm font-medium text-slate-500">{label}</p>
        <div className={`rounded-lg p-2 ${colorClasses[color]}`}>{icon}</div>
      </div>
      <p className="mt-4 text-3xl font-semibold tracking-tight text-slate-950">{value}</p>
    </div>
  );
}

function StatusRow({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  const colorClasses: Record<string, string> = {
    emerald: "text-emerald-600",
    amber: "text-amber-600",
    red: "text-red-600",
    slate: "text-slate-600",
  };

  return (
    <div className={`flex justify-between border-t border-slate-200 pt-3 ${
      label !== "Active" ? "border-t" : ""
    }`}>
      <span className="text-slate-600">{label}</span>
      <span className={`font-medium ${colorClasses[color]}`}>{value}</span>
    </div>
  );
}
