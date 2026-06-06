"use client";

import { useEffect, useState } from "react";

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

const emptyForm = {
  name: "",
  description: "",
  durationMonths: 1,
  baseMonthlyPrice: 0,
  discountPercentage: 0,
  allowPartialPayment: false,
  isActive: true,
};

export default function PlansPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  async function loadPlans() {
    const response = await fetch("/api/plan");
    const data = await response.json();

    setPlans(data.plans || []);
  }

  useEffect(() => {
    async function init() {
      await loadPlans();
      setLoading(false);
    }

    init();
  }, []);

  async function savePlan(e: React.FormEvent) {
    e.preventDefault();

    const response = await fetch(editingId ? `/api/plan/${editingId}` : "/api/plan", {
      method: editingId ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await response.json();

    if (data.success) {
      await loadPlans();
      setForm(emptyForm);
      setEditingId(null);
    }
  }

  function editPlan(plan: Plan) {
    setEditingId(plan._id);
    setForm({
      name: plan.name,
      description: plan.description,
      durationMonths: plan.durationMonths,
      baseMonthlyPrice: plan.baseMonthlyPrice,
      discountPercentage: plan.discountPercentage || 0,
      allowPartialPayment: Boolean(plan.allowPartialPayment),
      isActive: plan.isActive !== false,
    });
  }

  async function deletePlan(id: string) {
    const response = await fetch(`/api/plan/${id}`, {
      method: "DELETE",
    });

    const data = await response.json();

    if (data.success) {
      await loadPlans();

      if (editingId === id) {
        setEditingId(null);
        setForm(emptyForm);
      }
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 p-8">
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-8 text-3xl font-bold text-slate-900">Plans</h1>

        <form
          onSubmit={savePlan}
          className="mb-8 space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <input
              placeholder="Plan Name"
              value={form.name}
              onChange={(e) =>
                setForm({
                  ...form,
                  name: e.target.value,
                })
              }
              className="w-full rounded border border-slate-300 p-2"
              required
            />

            <input
              type="number"
              placeholder="Months"
              value={form.durationMonths}
              onChange={(e) =>
                setForm({
                  ...form,
                  durationMonths: Number(e.target.value),
                })
              }
              className="w-full rounded border border-slate-300 p-2"
              min={1}
              required
            />

            <input
              type="number"
              placeholder="Monthly Price"
              value={form.baseMonthlyPrice}
              onChange={(e) =>
                setForm({
                  ...form,
                  baseMonthlyPrice: Number(e.target.value),
                })
              }
              className="w-full rounded border border-slate-300 p-2"
              min={0}
              required
            />

            <input
              type="number"
              placeholder="Discount Percentage"
              value={form.discountPercentage}
              onChange={(e) =>
                setForm({
                  ...form,
                  discountPercentage: Number(e.target.value),
                })
              }
              className="w-full rounded border border-slate-300 p-2"
              min={0}
              max={100}
            />
          </div>

          <textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) =>
              setForm({
                ...form,
                description: e.target.value,
              })
            }
            className="min-h-24 w-full rounded border border-slate-300 p-2"
            required
          />

          <div className="flex flex-wrap gap-6 text-sm text-slate-700">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.allowPartialPayment}
                onChange={(e) =>
                  setForm({
                    ...form,
                    allowPartialPayment: e.target.checked,
                  })
                }
              />
              Allow partial payment
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) =>
                  setForm({
                    ...form,
                    isActive: e.target.checked,
                  })
                }
              />
              Active plan
            </label>
          </div>

          <div className="flex flex-wrap gap-3">
            <button className="rounded bg-black px-4 py-2 text-white">
              {editingId ? "Update Plan" : "Create Plan"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setForm(emptyForm);
                }}
                className="rounded border border-slate-300 px-4 py-2"
              >
                Cancel Edit
              </button>
            )}
          </div>
        </form>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {plans.map((plan) => (
              <div
                key={plan._id}
                className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="font-bold text-slate-900">{plan.name}</h2>
                    <p className="mt-1 text-sm text-slate-600">{plan.description}</p>
                  </div>

                  <span className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-700">
                    {plan.isActive === false ? "Inactive" : "Active"}
                  </span>
                </div>

                <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <dt className="text-slate-500">Duration</dt>
                    <dd className="font-medium">{plan.durationMonths} months</dd>
                  </div>

                  <div>
                    <dt className="text-slate-500">Monthly Price</dt>
                    <dd className="font-medium">Rs {plan.baseMonthlyPrice}</dd>
                  </div>

                  <div>
                    <dt className="text-slate-500">Discount</dt>
                    <dd className="font-medium">{plan.discountPercentage || 0}%</dd>
                  </div>

                  <div>
                    <dt className="text-slate-500">Partial Payment</dt>
                    <dd className="font-medium">{plan.allowPartialPayment ? "Yes" : "No"}</dd>
                  </div>
                </dl>

                <div className="mt-4 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => editPlan(plan)}
                    className="rounded border border-slate-300 px-3 py-2 text-sm"
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => deletePlan(plan._id)}
                    className="rounded bg-red-600 px-3 py-2 text-sm text-white"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
