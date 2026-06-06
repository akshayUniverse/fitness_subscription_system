"use client";

import { useEffect, useState } from "react";
import { Edit, Trash2 } from "lucide-react";

import { AdminShell } from "@/components/layout/sidebar";

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
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function loadPlans() {
    const response = await fetch("/api/plan");
    const data = await response.json();

    setPlans(data.plans || []);
  }

  useEffect(() => {
    async function init() {
      try {
        await loadPlans();
      } catch {
        setError("Failed to load plans");
      } finally {
        setLoading(false);
      }
    }

    init();
  }, []);

  async function savePlan(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch(editingId ? `/api/plan/${editingId}` : "/api/plan", {
        method: editingId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Failed to save plan");
      }

      await loadPlans();
      setForm(emptyForm);
      setEditingId(null);
      setMessage(editingId ? "Plan updated successfully." : "Plan created successfully.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save plan");
    } finally {
      setSaving(false);
    }
  }

  function editPlan(plan: Plan) {
    setEditingId(plan._id);
    setMessage("");
    setError("");
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
    setError("");
    setMessage("");

    try {
      const response = await fetch(`/api/plan/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Failed to delete plan");
      }

      await loadPlans();
      setMessage("Plan deleted successfully.");

      if (editingId === id) {
        setEditingId(null);
        setForm(emptyForm);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete plan");
    }
  }

  return (
    <AdminShell>
      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[380px_1fr] lg:px-8">
        <div>
          <p className="text-sm font-medium text-slate-500">Plan manager</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-950">Subscription Plans</h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Create pricing plans, control partial payments, and keep inactive offers hidden from customers.
          </p>

          <form
            onSubmit={savePlan}
            className="mt-6 space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <FormField label="Plan name">
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="field"
                required
              />
            </FormField>

            <FormField label="Description">
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="field min-h-24"
                required
              />
            </FormField>

            <div className="grid grid-cols-2 gap-3">
              <FormField label="Months">
                <input
                  type="number"
                  value={form.durationMonths}
                  onChange={(e) => setForm({ ...form, durationMonths: Number(e.target.value) })}
                  className="field"
                  min={1}
                  required
                />
              </FormField>

              <FormField label="Monthly price">
                <input
                  type="number"
                  value={form.baseMonthlyPrice}
                  onChange={(e) => setForm({ ...form, baseMonthlyPrice: Number(e.target.value) })}
                  className="field"
                  min={0}
                  required
                />
              </FormField>
            </div>

            <FormField label="Discount percentage">
              <input
                type="number"
                value={form.discountPercentage}
                onChange={(e) => setForm({ ...form, discountPercentage: Number(e.target.value) })}
                className="field"
                min={0}
                max={100}
              />
            </FormField>

            <div className="grid gap-3 text-sm text-slate-700">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.allowPartialPayment}
                  onChange={(e) => setForm({ ...form, allowPartialPayment: e.target.checked })}
                />
                Allow partial payment
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                />
                Active plan
              </label>
            </div>

            {message && <p className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700">{message}</p>}
            {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}

            <div className="flex flex-wrap gap-3">
              <button
                disabled={saving}
                className="rounded-lg bg-slate-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 disabled:opacity-60"
              >
                {saving ? "Saving..." : editingId ? "Update Plan" : "Create Plan"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setForm(emptyForm);
                  }}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-5 py-4">
            <h2 className="font-semibold text-slate-950">All plans</h2>
            <p className="mt-1 text-sm text-slate-500">{plans.length} plans configured</p>
          </div>

          {loading ? (
            <div className="grid gap-4 p-5 md:grid-cols-2">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="h-40 animate-pulse rounded-xl bg-slate-100" />
              ))}
            </div>
          ) : plans.length === 0 ? (
            <div className="p-10 text-center">
              <h3 className="font-semibold text-slate-950">No plans yet</h3>
              <p className="mt-2 text-sm text-slate-500">Create the first subscription plan from the form.</p>
            </div>
          ) : (
            <div className="grid gap-4 p-5 md:grid-cols-2">
              {plans.map((plan) => (
                <article key={plan._id} className="rounded-xl border border-slate-200 p-4 transition hover:border-slate-300 hover:shadow-sm">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-slate-950">{plan.name}</h3>
                      <p className="mt-1 line-clamp-2 text-sm leading-6 text-slate-500">{plan.description}</p>
                    </div>
                    <Badge label={plan.isActive === false ? "Inactive" : "Active"} muted={plan.isActive === false} />
                  </div>

                  <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
                    <Detail label="Duration" value={`${plan.durationMonths} months`} />
                    <Detail label="Price" value={`Rs ${plan.baseMonthlyPrice}`} />
                    <Detail label="Discount" value={`${plan.discountPercentage || 0}%`} />
                    <Detail label="Partial" value={plan.allowPartialPayment ? "Allowed" : "No"} />
                  </dl>

                  <div className="mt-5 flex gap-2">
                    <button
                      type="button"
                      onClick={() => editPlan(plan)}
                      className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                    >
                      <Edit className="size-4" />
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => deletePlan(plan._id)}
                      className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-red-700"
                    >
                      <Trash2 className="size-4" />
                      Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </AdminShell>
  );
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block text-sm font-medium text-slate-700">
      <span>{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-slate-500">{label}</dt>
      <dd className="mt-1 font-medium text-slate-950">{value}</dd>
    </div>
  );
}

function Badge({ label, muted }: { label: string; muted?: boolean }) {
  return (
    <span className={`rounded-full px-2 py-1 text-xs font-medium ${muted ? "bg-slate-100 text-slate-600" : "bg-emerald-50 text-emerald-700"}`}>
      {label}
    </span>
  );
}
