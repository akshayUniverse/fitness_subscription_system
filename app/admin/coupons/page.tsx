"use client";

import { useEffect, useState } from "react";
import { Edit, Trash2 } from "lucide-react";

import { AdminShell } from "@/components/layout/sidebar";

interface Coupon {
  _id: string;
  code: string;
  type: string;
  value: number;
  expiryDate: string;
  isActive: boolean;
}

const emptyForm = {
  code: "",
  type: "PERCENTAGE",
  value: 0,
  expiryDate: "",
  isActive: true,
};

function toDateInputValue(date: string) {
  return date ? new Date(date).toISOString().slice(0, 10) : "";
}

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function loadCoupons() {
    const response = await fetch("/api/coupon");
    const data = await response.json();

    setCoupons(data.coupons || []);
  }

  useEffect(() => {
    async function init() {
      try {
        await loadCoupons();
      } catch {
        setError("Failed to load coupons");
      } finally {
        setLoading(false);
      }
    }

    init();
  }, []);

  async function saveCoupon(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch(editingId ? `/api/coupon/${editingId}` : "/api/coupon", {
        method: editingId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Failed to save coupon");
      }

      await loadCoupons();
      setForm(emptyForm);
      setEditingId(null);
      setMessage(editingId ? "Coupon updated successfully." : "Coupon created successfully.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save coupon");
    } finally {
      setSaving(false);
    }
  }

  function editCoupon(coupon: Coupon) {
    setEditingId(coupon._id);
    setMessage("");
    setError("");
    setForm({
      code: coupon.code,
      type: coupon.type,
      value: coupon.value,
      expiryDate: toDateInputValue(coupon.expiryDate),
      isActive: coupon.isActive,
    });
  }

  async function deleteCoupon(id: string) {
    setError("");
    setMessage("");

    try {
      const response = await fetch(`/api/coupon/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Failed to delete coupon");
      }

      await loadCoupons();
      setMessage("Coupon deleted successfully.");

      if (editingId === id) {
        setEditingId(null);
        setForm(emptyForm);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete coupon");
    }
  }

  return (
    <AdminShell>
      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[380px_1fr] lg:px-8">
        <div>
          <p className="text-sm font-medium text-slate-500">Coupon manager</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-950">Discount Coupons</h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Create percentage and flat discounts with clear active states and expiry dates.
          </p>

          <form
            onSubmit={saveCoupon}
            className="mt-6 space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <FormField label="Coupon code">
              <input
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                className="field uppercase"
                required
              />
            </FormField>

            <div className="grid grid-cols-2 gap-3">
              <FormField label="Type">
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className="field"
                >
                  <option value="PERCENTAGE">Percentage</option>
                  <option value="FLAT">Flat</option>
                </select>
              </FormField>

              <FormField label="Value">
                <input
                  type="number"
                  value={form.value}
                  onChange={(e) => setForm({ ...form, value: Number(e.target.value) })}
                  className="field"
                  min={1}
                  required
                />
              </FormField>
            </div>

            <FormField label="Expiry date">
              <input
                type="date"
                value={form.expiryDate}
                onChange={(e) => setForm({ ...form, expiryDate: e.target.value })}
                className="field"
                required
              />
            </FormField>

            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
              />
              Active coupon
            </label>

            {message && <p className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700">{message}</p>}
            {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}

            <div className="flex flex-wrap gap-3">
              <button
                disabled={saving}
                className="rounded-lg bg-slate-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 disabled:opacity-60"
              >
                {saving ? "Saving..." : editingId ? "Update Coupon" : "Create Coupon"}
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
            <h2 className="font-semibold text-slate-950">All coupons</h2>
            <p className="mt-1 text-sm text-slate-500">{coupons.length} coupons configured</p>
          </div>

          {loading ? (
            <div className="grid gap-4 p-5 md:grid-cols-2">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="h-36 animate-pulse rounded-xl bg-slate-100" />
              ))}
            </div>
          ) : coupons.length === 0 ? (
            <div className="p-10 text-center">
              <h3 className="font-semibold text-slate-950">No coupons yet</h3>
              <p className="mt-2 text-sm text-slate-500">Create a discount coupon from the form.</p>
            </div>
          ) : (
            <div className="grid gap-4 p-5 md:grid-cols-2">
              {coupons.map((coupon) => (
                <article key={coupon._id} className="rounded-xl border border-slate-200 p-4 transition hover:border-slate-300 hover:shadow-sm">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-semibold tracking-wide text-slate-950">{coupon.code}</h3>
                      <p className="mt-1 text-sm text-slate-500">
                        {coupon.type === "PERCENTAGE" ? `${coupon.value}% off` : `Rs ${coupon.value} off`}
                      </p>
                    </div>
                    <Badge label={coupon.isActive ? "Active" : "Inactive"} muted={!coupon.isActive} />
                  </div>

                  <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
                    <Detail label="Type" value={coupon.type} />
                    <Detail label="Value" value={String(coupon.value)} />
                    <Detail label="Expiry" value={new Date(coupon.expiryDate).toLocaleDateString()} />
                  </dl>

                  <div className="mt-5 flex gap-2">
                    <button
                      type="button"
                      onClick={() => editCoupon(coupon)}
                      className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                    >
                      <Edit className="size-4" />
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteCoupon(coupon._id)}
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
