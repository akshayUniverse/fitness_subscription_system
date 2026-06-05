"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { UserButton } from "@clerk/nextjs";
interface User {
  _id: string;
  clerkId: string;
  email: string;
  name: string;
  role: string;
  activeSubscriptionId?: string;
}

interface Subscription {
  _id: string;
  totalAmount: number;
  paidAmount: number;
  balanceDue: number;
  paymentType: string;
  status: string;
  startDate: string;
  endDate: string;

  planSnapshot: {
    name: string;
    description: string;
    durationMonths: number;
    baseMonthlyPrice: number;
    discountPercentage: number;
  };
}

export default function DashboardPage() {
 const [user, setUser] =
  useState<User | null>(null);

const [subscription, setSubscription] =
  useState<Subscription | null>(null);

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
      <div className="min-h-screen flex items-center justify-center">
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

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="border rounded-lg p-5 bg-white">
              <p className="text-sm text-slate-500">
                Member
              </p>

              <h3 className="text-lg font-semibold">
                {user?.name}
              </h3>
            </div>

            <div className="border rounded-lg p-5 bg-white">
              <p className="text-sm text-slate-500">
                Current Plan
              </p>

              <h3 className="text-lg font-semibold">
                {subscription?.planSnapshot
                  ?.name || "No Plan"}
              </h3>
            </div>

            <div className="border rounded-lg p-5 bg-white">
              <p className="text-sm text-slate-500">
                Status
              </p>

              <h3 className="text-lg font-semibold">
                {subscription?.status ||
                  "N/A"}
              </h3>
            </div>
          </div>

          {/* Subscription Details */}
          {subscription ? (
            <div className="border rounded-lg p-6 bg-slate-50 mb-8">
              <h3 className="text-xl font-semibold mb-4">
                Subscription Details
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <p>
                  <strong>Total Amount:</strong>{" "}
                  ₹{subscription.totalAmount}
                </p>

                <p>
                  <strong>Paid Amount:</strong>{" "}
                  ₹{subscription.paidAmount}
                </p>

                <p>
                  <strong>Balance Due:</strong>{" "}
                  ₹{subscription.balanceDue}
                </p>

                <p>
                  <strong>Payment Type:</strong>{" "}
                  {subscription.paymentType}
                </p>

                <p>
                  <strong>Start Date:</strong>{" "}
                  {new Date(
                    subscription.startDate
                  ).toLocaleDateString()}
                </p>

                <p>
                  <strong>End Date:</strong>{" "}
                  {new Date(
                    subscription.endDate
                  ).toLocaleDateString()}
                </p>
              </div>
            </div>
          ) : (
            <div className="border rounded-lg p-6 bg-slate-50 mb-8">
              <p className="text-slate-600">
                No active subscription found.
              </p>
            </div>
          )}

          {/* Navigation Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              href="/billing"
              className="p-6 border border-slate-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition"
            >
              <h3 className="font-semibold text-slate-900">
                View Billing History
              </h3>

              <p className="text-sm text-slate-600 mt-2">
                Check invoices and payment records
              </p>
            </Link>

            <div className="p-6 border border-slate-200 rounded-lg opacity-50 cursor-not-allowed">
              <h3 className="font-semibold text-slate-900">
                Manage Subscription
              </h3>

              <p className="text-sm text-slate-600 mt-2">
                Upgrade and plan changes coming soon
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}