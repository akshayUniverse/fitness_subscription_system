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

export default function CouponsPage() {
  const [coupons, setCoupons] =
    useState<Coupon[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [form, setForm] =
    useState({
      code: "",
      type: "PERCENTAGE",
      value: 0,
      expiryDate: "",
    });

  async function loadCoupons() {
    const response =
      await fetch("/api/coupon");

    const data =
      await response.json();

    setCoupons(data.coupons || []);
  }

  useEffect(() => {
    loadCoupons().finally(() =>
      setLoading(false)
    );
  }, []);

  async function createCoupon(
    e: React.FormEvent
  ) {
    e.preventDefault();

    const response = await fetch(
      "/api/coupon",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify(form),
      }
    );

    const data =
      await response.json();

    if (data.success) {
      await loadCoupons();

      setForm({
        code: "",
        type: "PERCENTAGE",
        value: 0,
        expiryDate: "",
      });
    }
  }

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-8">
        Coupons
      </h1>

      <form
        onSubmit={createCoupon}
        className="border rounded-xl p-6 mb-8 space-y-4"
      >
        <input
          placeholder="Coupon Code"
          value={form.code}
          onChange={(e) =>
            setForm({
              ...form,
              code: e.target.value,
            })
          }
          className="w-full border p-2 rounded"
        />

        <select
          value={form.type}
          onChange={(e) =>
            setForm({
              ...form,
              type: e.target.value,
            })
          }
          className="w-full border p-2 rounded"
        >
          <option value="PERCENTAGE">
            Percentage
          </option>

          <option value="FLAT">
            Flat
          </option>
        </select>

        <input
          type="number"
          placeholder="Value"
          value={form.value}
          onChange={(e) =>
            setForm({
              ...form,
              value: Number(
                e.target.value
              ),
            })
          }
          className="w-full border p-2 rounded"
        />

        <input
          type="date"
          value={form.expiryDate}
          onChange={(e) =>
            setForm({
              ...form,
              expiryDate:
                e.target.value,
            })
          }
          className="w-full border p-2 rounded"
        />

        <button
          className="px-4 py-2 bg-black text-white rounded"
        >
          Create Coupon
        </button>
      </form>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="space-y-4">
          {coupons.map((coupon) => (
            <div
              key={coupon._id}
              className="border rounded-xl p-4"
            >
              <h2 className="font-bold">
                {coupon.code}
              </h2>

              <p>
                Type:
                {coupon.type}
              </p>

              <p>
                Value:
                {coupon.value}
              </p>

              <p>
                Expiry:
                {new Date(
                  coupon.expiryDate
                ).toLocaleDateString()}
              </p>

              <p>
                Status:
                {coupon.isActive
                  ? "Active"
                  : "Inactive"}
              </p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}