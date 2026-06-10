"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, CalendarDays, CreditCard, Tag } from "lucide-react";

import { UserShell } from "@/components/layout/navbar";
import StatusBadge from "@/constants/dashboard/status-badge";
import { SubscriptionTypes } from "@/types/subscription.types";
import { TransactionTypes } from "@/types/transaction.types";
import { PaymentModal } from "@/components/modals/payment-modal";

export default function SubscriptionDetailsPage() {
  const params = useParams();
  const subscriptionId = params.id as string;

  const [subscription, setSubscription] = useState<SubscriptionTypes | null>(null);
  const [transactions, setTransactions] = useState<TransactionTypes[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    async function loadDetails() {
      try {
        setLoading(true);

        const [subRes, txRes] = await Promise.all([
          fetch(`/api/subscription/${subscriptionId}`),
          fetch(`/api/transaction?subscriptionId=${subscriptionId}`),
        ]);

        const subData = await subRes.json();
        const txData = await txRes.json();

        if (!subData.success) {
          throw new Error(subData.message || "Failed to load subscription");
        }

        setSubscription(subData.subscription);
        setTransactions(txData.transactions || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load subscription");
      } finally {
        setLoading(false);
      }
    }

    loadDetails();
  }, [subscriptionId, refreshTrigger]);

  const handlePaymentSuccess = () => {
    setShowPaymentModal(false);
    setRefreshTrigger((prev) => prev + 1);
  };

  if (loading) {
    return (
      <UserShell>
        <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="h-96 animate-pulse rounded-xl border border-slate-200 bg-white" />
        </section>
      </UserShell>
    );
  }

  if (error || !subscription) {
    return (
      <UserShell>
        <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <Link
            href="/dashboard"
            className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-950"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
          <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">
            {error || "Subscription not found"}
          </div>
        </section>
      </UserShell>
    );
  }

  const progress =
    subscription.totalAmount > 0
      ? Math.min((subscription.paidAmount / subscription.totalAmount) * 100, 100)
      : 0;

  return (
    <UserShell>
      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <Link
          href="/dashboard"
          className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-950"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
                {subscription.planSnapshot?.name || "Subscription"}
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Subscription ID: {subscriptionId.slice(0, 8)}...
              </p>
            </div>
            <div>
              <StatusBadge status={subscription.status} />
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
            <h2 className="font-semibold text-slate-950">Subscription Details</h2>

            <div className="mt-6 space-y-6">
              <div>
                <h3 className="text-sm font-medium text-slate-500">Plan Information</h3>
                <dl className="mt-3 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-slate-600">Plan Name</dt>
                    <dd className="font-medium text-slate-950">
                      {subscription.planSnapshot?.name}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-slate-600">Duration</dt>
                    <dd className="font-medium text-slate-950">
                      {subscription.planSnapshot?.durationMonths} months
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-slate-600">Monthly Price</dt>
                    <dd className="font-medium text-slate-950">
                      Rs {subscription.planSnapshot?.baseMonthlyPrice}
                    </dd>
                  </div>
                </dl>
              </div>

              {subscription.couponSnapshot && (
                <div>
                  <h3 className="text-sm font-medium text-slate-500">Applied Coupon</h3>
                  <dl className="mt-3 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-slate-600">Code</dt>
                      <dd className="font-mono font-medium text-slate-950">
                        {subscription.couponSnapshot?.code}
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-slate-600">Type</dt>
                      <dd className="font-medium text-slate-950">
                        {subscription.couponSnapshot?.type}
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-slate-600">Value</dt>
                      <dd className="font-medium text-slate-950">
                        {subscription.couponSnapshot?.type === "PERCENTAGE"
                          ? `${subscription.couponSnapshot?.value}%`
                          : `Rs ${subscription.couponSnapshot?.value}`}
                      </dd>
                    </div>
                  </dl>
                </div>
              )}

              <div className="border-t border-slate-200 pt-6">
                <h3 className="text-sm font-medium text-slate-500">Dates</h3>
                <dl className="mt-3 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-slate-600">Start Date</dt>
                    <dd className="font-medium text-slate-950">
                      {new Date(subscription.startDate).toLocaleDateString()}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-slate-600">End Date</dt>
                    <dd className="font-medium text-slate-950">
                      {new Date(subscription.endDate).toLocaleDateString()}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="font-semibold text-slate-950">Payment Summary</h2>
              <div className="mt-6 space-y-4 text-sm">
                <div>
                  <p className="text-slate-500">Total Amount</p>
                  <p className="text-2xl font-semibold text-slate-950">
                    Rs {subscription.totalAmount}
                  </p>
                </div>
                <div className="border-t border-slate-200 pt-4">
                  <p className="text-slate-500">Paid Amount</p>
                  <p className="text-xl font-semibold text-emerald-600">
                    Rs {subscription.paidAmount}
                  </p>
                </div>
                <div className="border-t border-slate-200 pt-4">
                  <p className="text-slate-500">Balance Due</p>
                  <p className="text-xl font-semibold text-orange-600">
                    Rs {subscription.balanceDue}
                  </p>
                </div>
                <div className="border-t border-slate-200 pt-4">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <p className="text-xs font-medium text-slate-600">Progress</p>
                    <p className="text-xs font-semibold text-slate-950">{Math.round(progress)}%</p>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-emerald-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              </div>

              {subscription.balanceDue > 0 && (
                <button
                  onClick={() => setShowPaymentModal(true)}
                  className="mt-6 w-full rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
                >
                  Pay Remaining
                </button>
              )}
            </div>
          </div>
        </div>

        {transactions.length > 0 && (
          <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="font-semibold text-slate-950">Transaction History</h2>

            <div className="mt-6 overflow-x-auto">
              <table className="w-full min-w-[760px] text-sm">
                <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Invoice</th>
                    <th className="px-4 py-3">Amount Paid</th>
                    <th className="px-4 py-3">Remaining Balance</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {transactions.map((tx) => (
                    <tr key={tx._id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-medium text-slate-950">
                        {tx.invoiceNumber}
                      </td>
                      <td className="px-4 py-3">Rs {tx.amountPaid}</td>
                      <td className="px-4 py-3">Rs {tx.remainingBalance}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${
                            tx.paymentStatus === "COMPLETED"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {tx.paymentStatus}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-500">
                        {new Date(tx.paymentDate).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>

      {showPaymentModal && subscription && (
        <PaymentModal
          subscriptionId={subscription._id}
          balanceDue={subscription.balanceDue}
          onSuccess={handlePaymentSuccess}
          onClose={() => setShowPaymentModal(false)}
        />
      )}
    </UserShell>
  );
}
