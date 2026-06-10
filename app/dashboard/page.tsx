"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Wallet } from "lucide-react";

import { UserShell } from "@/components/layout/navbar";
import { SubscriptionCard } from "@/components/shared/subscription-card";
import { PaymentModal } from "@/components/modals/payment-modal";
import { ExpiryWarning } from "@/components/shared/expiry-warning";
import { SubscriptionTypes } from "@/types/subscription.types";
import { UserTypes } from "@/types/user.types";

export default function DashboardPage() {
  const [user, setUser] = useState<UserTypes | null>(null);
  const [subscriptions, setSubscriptions] = useState<SubscriptionTypes[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedSubForPayment, setSelectedSubForPayment] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const userRes = await fetch("/api/user/me");
        const userData = await userRes.json();

        if (!userData.success) {
          throw new Error(userData.message || "Failed to load user");
        }

        setUser(userData.user);

        if (userData.user?.userId || userData.user?._id) {
          const userId = userData.user.userId || userData.user._id;
          const subRes = await fetch(`/api/user/subscriptions?userId=${userId}`);
          const subData = await subRes.json();

          if (subData.success) {
            setSubscriptions(subData.subscriptions || []);
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, [refreshTrigger]);

  const handlePaymentSuccess = () => {
    setSelectedSubForPayment(null);
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleDetailsClick = (subscriptionId: string) => {
    // Navigate to subscription details page
    window.location.href = `/subscriptions/${subscriptionId}`;
  };

  return (
    <UserShell>
      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm font-medium text-slate-500">Welcome back</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-950">
            {user?.name || "Member Dashboard"}
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Manage all your subscriptions, track payments, and view renewal dates.
          </p>
        </div>

        {loading ? (
          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div key={item} className="h-64 animate-pulse rounded-xl border border-slate-200 bg-white" />
            ))}
          </div>
        ) : error ? (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>
        ) : subscriptions.length === 0 ? (
          <div className="mt-6 rounded-xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <Wallet className="mx-auto h-12 w-12 text-slate-300" />
            <h2 className="mt-4 text-lg font-semibold text-slate-950">No subscriptions yet</h2>
            <p className="mt-2 text-sm text-slate-500">
              Start your fitness journey by selecting a plan.
            </p>
            <Link
              href="/plans"
              className="mt-4 inline-flex rounded-lg bg-slate-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
            >
              Browse Plans
            </Link>
          </div>
        ) : (
          <div className="mt-6">
            <ExpiryWarning subscriptions={subscriptions} />
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-950">
                Your Subscriptions
              </h2>
              <span className="text-sm text-slate-500">
                {subscriptions.length} subscription{subscriptions.length !== 1 ? "s" : ""}
              </span>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {subscriptions.map((subscription) => (
                <SubscriptionCard
                  key={subscription._id}
                  subscription={subscription}
                  onPayClick={setSelectedSubForPayment}
                  onDetailsClick={handleDetailsClick}
                />
              ))}
            </div>
          </div>
        )}

        <div className="mt-6 flex gap-3">
          <Link
            href="/plans"
            className="inline-flex rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            View Plans
          </Link>
          <Link
            href="/billing"
            className="inline-flex rounded-lg bg-slate-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            View Billing History
          </Link>
        </div>
      </section>

      {selectedSubForPayment && (
        <PaymentModal
          subscriptionId={selectedSubForPayment}
          balanceDue={
            subscriptions.find((s) => s._id === selectedSubForPayment)?.balanceDue || 0
          }
          onSuccess={handlePaymentSuccess}
          onClose={() => setSelectedSubForPayment(null)}
        />
      )}
    </UserShell>
  );
}
