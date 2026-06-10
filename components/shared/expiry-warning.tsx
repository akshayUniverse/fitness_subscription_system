"use client";

import { AlertCircle, X } from "lucide-react";
import { useState } from "react";

interface ExpiryWarningProps {
  subscriptions: Array<{
    _id: string;
    endDate: string;
    planSnapshot?: { name: string };
  }>;
}

export function ExpiryWarning({ subscriptions }: ExpiryWarningProps) {
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  const now = new Date();
  const threeDaysLater = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);

  const expiringSubscriptions = subscriptions.filter((sub) => {
    const endDate = new Date(sub.endDate);
    return endDate > now && endDate <= threeDaysLater && !dismissed.has(sub._id);
  });

  if (expiringSubscriptions.length === 0) {
    return null;
  }

  const handleDismiss = (subscriptionId: string) => {
    setDismissed((prev) => new Set([...prev, subscriptionId]));
  };

  return (
    <>
      {expiringSubscriptions.map((sub) => {
        const endDate = new Date(sub.endDate);
        const daysLeft = Math.ceil((endDate.getTime() - now.getTime()) / (24 * 60 * 60 * 1000));

        return (
          <div
            key={sub._id}
            className="mb-4 flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-900"
          >
            <AlertCircle className="h-5 w-5 flex-shrink-0 text-amber-600" />
            <div className="flex-1">
              <p className="font-medium">
                Your subscription will expire in {daysLeft} {daysLeft === 1 ? "day" : "days"}
              </p>
              <p className="text-sm text-amber-800">
                {sub.planSnapshot?.name || "Subscription"} expires on{" "}
                {endDate.toLocaleDateString()}
              </p>
            </div>
            <button
              onClick={() => handleDismiss(sub._id)}
              className="text-amber-600 hover:text-amber-700"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </>
  );
}
