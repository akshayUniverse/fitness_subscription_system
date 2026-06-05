"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { UserButton } from "@clerk/nextjs";

import StatCard from "@/constants/dashboard/stat-card";
import StatusBadge from "@/constants/dashboard/status-badge";
import SectionCard from "@/constants/dashboard/section-card";

import { UserTypes } from "@/types/user.types";
import { SubscriptionTypes } from "@/types/subscription.types";

export default function DashboardPage() {
  const [user, setUser] =
    useState<UserTypes | null>(null);

  const [subscription, setSubscription] =
    useState<SubscriptionTypes | null>(
      null
    );

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const userRes =
          await fetch("/api/user/me");

        const userData =
          await userRes.json();

        setUser(userData.user);

        if (
          userData.user
            ?.activeSubscriptionId
        ) {
          const subRes =
            await fetch(
              `/api/subscription/${userData.user.activeSubscriptionId}`
            );

          const subData =
            await subRes.json();

          setSubscription(
            subData.subscription
          );
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg">
        Loading Dashboard...
      </div>
    );
  }

  return (
    <main className="min-h-screen flex flex-col bg-slate-50">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-900">
            User Dashboard
          </h1>

          <div className="flex items-center gap-4">
            <Link
              href="/billing"
              className="text-slate-600 hover:text-slate-900"
            >
              Billing
            </Link>

            <UserButton />
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-7xl mx-auto w-full px-8 py-12 flex-1">
        <div className="rounded-3xl border border-slate-200 bg-white p-10 shadow-sm">
          <h2 className="text-3xl font-semibold mb-8">
            Dashboard
          </h2>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatCard
              title="Current Plan"
              value={
                subscription?.planSnapshot
                  ?.name || "No Plan"
              }
            />

            <StatCard
              title="Balance Due"
              value={`₹${
                subscription?.balanceDue ||
                0
              }`}
            />

            <StatCard
              title="Paid Amount"
              value={`₹${
                subscription?.paidAmount ||
                0
              }`}
            />
          </div>

          {/* Subscription Overview */}
          <SectionCard title="Subscription Overview">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <p>
                <strong>Member:</strong>{" "}
                {user?.name}
              </p>

              <p>
                <strong>Status:</strong>{" "}
                <StatusBadge
                  status={
                    subscription?.status ||
                    "UNKNOWN"
                  }
                />
              </p>

              <p>
                <strong>
                  Payment Type:
                </strong>{" "}
                {subscription?.paymentType ||
                  "-"}
              </p>

              <p>
                <strong>
                  Total Amount:
                </strong>{" "}
                ₹
                {subscription?.totalAmount ||
                  0}
              </p>

              <p>
                <strong>
                  Start Date:
                </strong>{" "}
                {subscription?.startDate
                  ? new Date(
                      subscription.startDate
                    ).toLocaleDateString()
                  : "-"}
              </p>

              <p>
                <strong>
                  End Date:
                </strong>{" "}
                {subscription?.endDate
                  ? new Date(
                      subscription.endDate
                    ).toLocaleDateString()
                  : "-"}
              </p>
            </div>

            {subscription && (
              <div className="mt-8">
                <div className="flex justify-between text-sm mb-2">
                  <span>
                    Payment Progress
                  </span>

                  <span>
                    ₹
                    {
                      subscription.paidAmount
                    }
                    /₹
                    {
                      subscription.totalAmount
                    }
                  </span>
                </div>

                <div className="h-3 rounded-full bg-slate-200 overflow-hidden">
                  <div
                    className="h-full bg-green-500 transition-all"
                    style={{
                      width: `${Math.min(
                        (subscription.paidAmount /
                          subscription.totalAmount) *
                          100,
                        100
                      )}%`,
                    }}
                  />
                </div>
              </div>
            )}
          </SectionCard>

          {/* Navigation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
            <Link
              href="/billing"
              className="p-6 border border-slate-200 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition"
            >
              <h3 className="font-semibold text-slate-900">
                View Billing History
              </h3>

              <p className="text-sm text-slate-600 mt-2">
                Check invoices and payment
                records
              </p>
            </Link>

            <div className="p-6 border border-slate-200 rounded-xl opacity-50 cursor-not-allowed">
              <h3 className="font-semibold text-slate-900">
                Manage Subscription
              </h3>

              <p className="text-sm text-slate-600 mt-2">
                Upgrade and plan changes
                coming soon
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}