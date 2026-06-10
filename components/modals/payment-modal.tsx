"use client";

import { useState } from "react";
import { X } from "lucide-react";

interface PaymentModalProps {
  subscriptionId: string;
  balanceDue: number;
  onSuccess: () => void;
  onClose: () => void;
}

export function PaymentModal({
  subscriptionId,
  balanceDue,
  onSuccess,
  onClose,
}: PaymentModalProps) {
  const [amount, setAmount] = useState<number>(balanceDue);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!amount || amount <= 0) {
      setError("Amount must be greater than 0");
      return;
    }

    if (amount > balanceDue) {
      setError(`Amount cannot exceed balance due (Rs ${balanceDue})`);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/transaction", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subscriptionId,
          amountPaid: amount,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Payment failed");
      }

      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Payment failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white shadow-lg">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-950">Make Payment</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700">
              Balance Due
            </label>
            <p className="mt-2 text-2xl font-semibold text-slate-950">
              Rs {balanceDue.toFixed(2)}
            </p>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700">
              Payment Amount *
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              max={balanceDue}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-950 focus:border-slate-950 focus:outline-none"
              required
            />
            <p className="mt-1 text-xs text-slate-500">
              Maximum: Rs {balanceDue.toFixed(2)}
            </p>
          </div>

          {error && (
            <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-lg bg-slate-950 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
            >
              {loading ? "Processing..." : "Pay Now"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
