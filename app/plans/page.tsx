"use client";

import { useEffect, useState } from "react";
import { Check, Loader2 } from "lucide-react";

import { UserShell } from "@/components/layout/navbar";

interface Plan {
  _id: string;
  name: string;
  description: string;
  durationMonths: number;
  baseMonthlyPrice: number;
  discountPercentage?: number;
  allowPartialPayment?: boolean;
  isActive?: boolean;
}

interface Coupon {
  _id: string;
  code: string;
  type: string;
  value: number;
}

export default function PlansPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [paymentType, setPaymentType] = useState<"FULL" | "PARTIAL">("FULL");
  const [couponCode, setCouponCode] = useState("");
  const [couponError, setCouponError] = useState("");
  const [couponData, setCouponData] = useState<Coupon | null>(null);
  const [validatingCoupon, setValidatingCoupon] = useState(false);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    async function loadPlans() {
      try {
        const response = await fetch("/api/plan");
        const data = await response.json();

        if (!data.success) {
          throw new Error(data.message || "Failed to load plans");
        }

        const activePlans = (data.plans || []).filter(
          (p: Plan) => p.isActive !== false
        );
        setPlans(activePlans);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load plans");
      } finally {
        setLoading(false);
      }
    }

    loadPlans();
  }, []);

  async function validateCoupon() {
    if (!couponCode.trim()) {
      setCouponError("");
      setCouponData(null);
      return;
    }

    setValidatingCoupon(true);
    setCouponError("");

    try {
      const response = await fetch(
        `/api/coupon?code=${encodeURIComponent(couponCode)}`
      );
      const data = await response.json();

      if (!data.success) {
        setCouponError(data.message || "Invalid coupon");
        setCouponData(null);
      } else {
        setCouponData(data.coupon);
        setCouponError("");
      }
    } catch (err) {
      setCouponError(
        err instanceof Error ? err.message : "Failed to validate coupon"
      );
      setCouponData(null);
    } finally {
      setValidatingCoupon(false);
    }
  }

  async function handleSubscribe(planId: string) {
    if (processing) return;

    setProcessing(true);

    try {
      // Get current user
      const userRes = await fetch("/api/user/me");
      const userData = await userRes.json();

      if (!userData.success) {
        throw new Error("Failed to load user");
      }

      // Create subscription
      const subRes = await fetch("/api/subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: userData.user._id,
          planId,
          couponCode: couponCode || undefined,
          paymentType,
        }),
      });

      const subData = await subRes.json();

      if (!subData.success) {
        throw new Error(subData.message || "Failed to create subscription");
      }

      // Show success and redirect
      alert("Subscription created successfully!");
      window.location.href = "/billing";
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to subscribe");
    } finally {
      setProcessing(false);
    }
  }

  const selectedPlanData = plans.find((p) => p._id === selectedPlan);

  let totalPrice = selectedPlanData
    ? selectedPlanData.baseMonthlyPrice * selectedPlanData.durationMonths
    : 0;

  if (selectedPlanData && selectedPlanData.discountPercentage) {
    totalPrice *= 1 - selectedPlanData.discountPercentage / 100;
  }

  if (couponData) {
    if (couponData.type === "PERCENTAGE") {
      totalPrice *= 1 - couponData.value / 100;
    } else {
      totalPrice = Math.max(totalPrice - couponData.value, 0);
    }
  }

  return (
    <UserShell>
      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-8">
          <p className="text-sm font-medium text-slate-500">Browse Plans</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-950">
            Subscribe to a Plan
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Choose a subscription plan that fits your fitness goals. Select your
            payment preference and apply a coupon if available.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-64 animate-pulse rounded-xl border border-slate-200 bg-white"
              />
            ))}
          </div>
        ) : error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        ) : plans.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <h2 className="text-lg font-semibold text-slate-950">
              No plans available
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Check back soon for available subscription plans.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {plans.map((plan) => {
              const baseTotal =
                plan.baseMonthlyPrice * plan.durationMonths;
              const discountedTotal = baseTotal *
                (1 - (plan.discountPercentage || 0) / 100);
              const finalTotal = discountedTotal;

              const isSelected = selectedPlan === plan._id;

              return (
                <div
                  key={plan._id}
                  onClick={() => setSelectedPlan(plan._id)}
                  className={`relative cursor-pointer rounded-xl border-2 p-6 transition-all ${
                    isSelected
                      ? "border-blue-500 bg-blue-50"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  {isSelected && (
                    <div className="absolute right-4 top-4 flex size-6 items-center justify-center rounded-full bg-blue-500 text-white">
                      <Check className="size-4" />
                    </div>
                  )}

                  <h3 className="text-lg font-semibold text-slate-950">
                    {plan.name}
                  </h3>

                  <p className="mt-2 text-sm text-slate-500">
                    {plan.description}
                  </p>

                  <div className="mt-4 space-y-2">
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-slate-950">
                        Rs {Math.round(finalTotal)}
                      </span>
                      {plan.discountPercentage && plan.discountPercentage > 0 && (
                        <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded">
                          {plan.discountPercentage}% off
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-500">
                      {plan.durationMonths} month
                      {plan.durationMonths > 1 ? "s" : ""} •{" "}
                      Rs {Math.round(plan.baseMonthlyPrice)}/month
                    </p>
                  </div>

                  <div className="mt-4 space-y-2 border-t border-slate-100 pt-4">
                    {plan.allowPartialPayment && (
                      <div className="flex items-center gap-2 text-xs text-slate-600">
                        <Check className="size-4 text-green-600" />
                        Partial payment available
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {selectedPlanData && (
          <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-950">
              Complete Your Purchase
            </h2>

            <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_300px]">
              <div className="space-y-6">
                {/* Payment Type Selection */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-3">
                    Payment Option
                  </label>

                  <div className="space-y-3">
                    {[
                      {
                        value: "FULL" as const,
                        label: "Full Payment Now",
                        description: "Pay the entire amount immediately",
                      },
                      ...(selectedPlanData.allowPartialPayment
                        ? [
                            {
                              value: "PARTIAL" as const,
                              label: "Partial Payment",
                              description: "Pay in installments",
                            },
                          ]
                        : []),
                    ].map((option) => (
                      <label
                        key={option.value}
                        className="flex items-center gap-3 rounded-lg border border-slate-200 p-4 cursor-pointer hover:bg-slate-50"
                      >
                        <input
                          type="radio"
                          name="paymentType"
                          value={option.value}
                          checked={paymentType === option.value}
                          onChange={(e) =>
                            setPaymentType(e.target.value as "FULL" | "PARTIAL")
                          }
                          className="h-4 w-4"
                        />
                        <div>
                          <p className="font-medium text-slate-950">
                            {option.label}
                          </p>
                          <p className="text-xs text-slate-500">
                            {option.description}
                          </p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Coupon Code */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Coupon Code (Optional)
                  </label>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => {
                        setCouponCode(e.target.value.toUpperCase());
                        setCouponError("");
                        setCouponData(null);
                      }}
                      placeholder="Enter coupon code"
                      className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={validateCoupon}
                      disabled={validatingCoupon}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-lg text-sm font-medium transition disabled:opacity-50"
                    >
                      {validatingCoupon ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        "Apply"
                      )}
                    </button>
                  </div>

                  {couponError && (
                    <p className="mt-2 text-xs text-red-600">{couponError}</p>
                  )}

                  {couponData && (
                    <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-xs font-medium text-green-900">
                        ✓ Coupon applied:{" "}
                        {couponData.type === "PERCENTAGE"
                          ? `${couponData.value}% off`
                          : `Rs ${couponData.value} off`}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Price Summary */}
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <h3 className="font-semibold text-slate-950">Summary</h3>

                <div className="mt-4 space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Base Price</span>
                    <span className="font-medium text-slate-950">
                      Rs{" "}
                      {Math.round(
                        selectedPlanData.baseMonthlyPrice *
                          selectedPlanData.durationMonths
                      )}
                    </span>
                  </div>

                  {selectedPlanData.discountPercentage &&
                    selectedPlanData.discountPercentage > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Plan Discount</span>
                        <span>
                          -Rs{" "}
                          {Math.round(
                            selectedPlanData.baseMonthlyPrice *
                              selectedPlanData.durationMonths *
                              (selectedPlanData.discountPercentage / 100)
                          )}
                        </span>
                      </div>
                    )}

                  {couponData && (
                    <div className="flex justify-between text-green-600">
                      <span>Coupon Discount</span>
                      <span>
                        -Rs{" "}
                        {Math.round(
                          couponData.type === "PERCENTAGE"
                            ? (selectedPlanData.baseMonthlyPrice *
                                selectedPlanData.durationMonths *
                                (1 - (selectedPlanData.discountPercentage || 0) / 100)) *
                                (couponData.value / 100)
                            : couponData.value
                        )}
                      </span>
                    </div>
                  )}

                  <div className="border-t border-slate-200 pt-3 flex justify-between font-semibold">
                    <span className="text-slate-950">Total Due</span>
                    <span className="text-slate-950">
                      Rs {Math.round(totalPrice)}
                    </span>
                  </div>

                  {paymentType === "PARTIAL" &&
                    selectedPlanData.allowPartialPayment && (
                      <div className="bg-blue-50 border border-blue-200 rounded p-3 text-xs text-blue-900">
                        You can pay in installments. First payment:{" "}
                        <span className="font-semibold">
                          Rs {Math.round(totalPrice * 0.3)}
                        </span>
                      </div>
                    )}
                </div>

                <button
                  onClick={() => handleSubscribe(selectedPlan!)}
                  disabled={processing}
                  className="w-full mt-6 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {processing ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Subscribe Now"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </section>
    </UserShell>
  );
}
