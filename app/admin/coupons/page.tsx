"use client";

import { useEffect, useState } from "react";

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
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  async function loadCoupons() {
    const response = await fetch("/api/coupon");
    const data = await response.json();

    setCoupons(data.coupons || []);
  }

  useEffect(() => {
    async function init() {
      await loadCoupons();
      setLoading(false);
    }

    init();
  }, []);

  async function saveCoupon(e: React.FormEvent) {
    e.preventDefault();

    const response = await fetch(editingId ? `/api/coupon/${editingId}` : "/api/coupon", {
      method: editingId ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await response.json();

    if (data.success) {
      await loadCoupons();
      setForm(emptyForm);
      setEditingId(null);
    }
  }

  function editCoupon(coupon: Coupon) {
    setEditingId(coupon._id);
    setForm({
      code: coupon.code,
      type: coupon.type,
      value: coupon.value,
      expiryDate: toDateInputValue(coupon.expiryDate),
      isActive: coupon.isActive,
    });
  }

  async function deleteCoupon(id: string) {
    const response = await fetch(`/api/coupon/${id}`, {
      method: "DELETE",
    });

    const data = await response.json();

    if (data.success) {
      await loadCoupons();

      if (editingId === id) {
        setEditingId(null);
        setForm(emptyForm);
      }
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 p-8">
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-8 text-3xl font-bold text-slate-900">Coupons</h1>

        <form
          onSubmit={saveCoupon}
          className="mb-8 space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <input
              placeholder="Coupon Code"
              value={form.code}
              onChange={(e) =>
                setForm({
                  ...form,
                  code: e.target.value,
                })
              }
              className="w-full rounded border border-slate-300 p-2 uppercase"
              required
            />

            <select
              value={form.type}
              onChange={(e) =>
                setForm({
                  ...form,
                  type: e.target.value,
                })
              }
              className="w-full rounded border border-slate-300 p-2"
            >
              <option value="PERCENTAGE">Percentage</option>
              <option value="FLAT">Flat</option>
            </select>

            <input
              type="number"
              placeholder="Value"
              value={form.value}
              onChange={(e) =>
                setForm({
                  ...form,
                  value: Number(e.target.value),
                })
              }
              className="w-full rounded border border-slate-300 p-2"
              min={1}
              required
            />

            <input
              type="date"
              value={form.expiryDate}
              onChange={(e) =>
                setForm({
                  ...form,
                  expiryDate: e.target.value,
                })
              }
              className="w-full rounded border border-slate-300 p-2"
              required
            />
          </div>

          <label className="flex items-center gap-2 text-sm text-slate-700">
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
            Active coupon
          </label>

          <div className="flex flex-wrap gap-3">
            <button className="rounded bg-black px-4 py-2 text-white">
              {editingId ? "Update Coupon" : "Create Coupon"}
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
            {coupons.map((coupon) => (
              <div
                key={coupon._id}
                className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <h2 className="font-bold text-slate-900">{coupon.code}</h2>
                  <span className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-700">
                    {coupon.isActive ? "Active" : "Inactive"}
                  </span>
                </div>

                <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <dt className="text-slate-500">Type</dt>
                    <dd className="font-medium">{coupon.type}</dd>
                  </div>

                  <div>
                    <dt className="text-slate-500">Value</dt>
                    <dd className="font-medium">{coupon.value}</dd>
                  </div>

                  <div>
                    <dt className="text-slate-500">Expiry</dt>
                    <dd className="font-medium">
                      {new Date(coupon.expiryDate).toLocaleDateString()}
                    </dd>
                  </div>
                </dl>

                <div className="mt-4 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => editCoupon(coupon)}
                    className="rounded border border-slate-300 px-3 py-2 text-sm"
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => deleteCoupon(coupon._id)}
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
