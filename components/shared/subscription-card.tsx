"use client";

import Link from "next/link";
import { SubscriptionTypes } from "@/types/subscription.types";
import StatusBadge from "@/constants/dashboard/status-badge";

interface SubscriptionCardProps {
  subscription: SubscriptionTypes;
  onPayClick?: (subscriptionId: string) => void;
  onDetailsClick?: (subscriptionId: string) => void;
}

export function SubscriptionCard({
  subscription,
  onPayClick,
  onDetailsClick,
}: SubscriptionCardProps) {
  const progress =
    subscription.totalAmount > 0
      ? Math.min((subscription.paidAmount / subscription.totalAmount) * 100, 100)
      : 0;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-slate-950">
            {subscription.planSnapshot?.name || "Plan"}
          </h3>
          <div className="mt-2 flex gap-2">
            <StatusBadge status={subscription.status} />
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-semibold text-slate-950">
            Rs {subscription.paidAmount}
          </p>
          <p className="text-xs text-slate-500">of Rs {subscription.totalAmount}</p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div>
          <p className="text-slate-500">Start Date</p>
          <p className="font-medium text-slate-950">
            {new Date(subscription.startDate).toLocaleDateString()}
          </p>
        </div>
        <div>
          <p className="text-slate-500">End Date</p>
          <p className="font-medium text-slate-950">
            {new Date(subscription.endDate).toLocaleDateString()}
          </p>
        </div>
        <div>
          <p className="text-slate-500">Payment Type</p>
          <p className="font-medium text-slate-950">{subscription.paymentType}</p>
        </div>
        <div>
          <p className="text-slate-500">Balance Due</p>
          <p className="font-medium text-slate-950">Rs {subscription.balanceDue}</p>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between gap-2 mb-2">
          <p className="text-xs font-medium text-slate-600">Progress</p>
          <p className="text-xs font-semibold text-slate-950">{Math.round(progress)}%</p>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-emerald-500 transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="mt-6 flex gap-2">
        {onDetailsClick && (
          <button
            onClick={() => onDetailsClick(subscription._id)}
            className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            View Details
          </button>
        )}
        {subscription.balanceDue > 0 && onPayClick && (
          <button
            onClick={() => onPayClick(subscription._id)}
            className="flex-1 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-700"
          >
            Pay Remaining
          </button>
        )}
      </div>
    </div>
  );
}
