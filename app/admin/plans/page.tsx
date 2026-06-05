"use client";

import { useEffect, useState } from "react";

interface Plan {
  _id: string;
  name: string;
  description: string;
  durationMonths: number;
  baseMonthlyPrice: number;
}

export default function PlansPage() {
  const [plans, setPlans] =
    useState<Plan[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [form, setForm] =
    useState({
      name: "",
      description: "",
      durationMonths: 1,
      baseMonthlyPrice: 0,
    });

  async function loadPlans() {
    const response =
      await fetch("/api/plan");

    const data =
      await response.json();

    setPlans(data.plans || []);
  }

  useEffect(() => {
    loadPlans().finally(() =>
      setLoading(false)
    );
  }, []);

  async function createPlan(
    e: React.FormEvent
  ) {
    e.preventDefault();

    const response = await fetch(
      "/api/plan",
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
      await loadPlans();

      setForm({
        name: "",
        description: "",
        durationMonths: 1,
        baseMonthlyPrice: 0,
      });
    }
  }

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-8">
        Plans
      </h1>

      <form
        onSubmit={createPlan}
        className="border rounded-xl p-6 mb-8 space-y-4"
      >
        <input
          placeholder="Plan Name"
          value={form.name}
          onChange={(e) =>
            setForm({
              ...form,
              name: e.target.value,
            })
          }
          className="w-full border p-2 rounded"
        />

        <input
          placeholder="Description"
          value={form.description}
          onChange={(e) =>
            setForm({
              ...form,
              description:
                e.target.value,
            })
          }
          className="w-full border p-2 rounded"
        />

        <input
          type="number"
          placeholder="Months"
          value={form.durationMonths}
          onChange={(e) =>
            setForm({
              ...form,
              durationMonths:
                Number(
                  e.target.value
                ),
            })
          }
          className="w-full border p-2 rounded"
        />

        <input
          type="number"
          placeholder="Price"
          value={form.baseMonthlyPrice}
          onChange={(e) =>
            setForm({
              ...form,
              baseMonthlyPrice:
                Number(
                  e.target.value
                ),
            })
          }
          className="w-full border p-2 rounded"
        />

        <button
          className="px-4 py-2 bg-black text-white rounded"
        >
          Create Plan
        </button>
      </form>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="space-y-4">
          {plans.map((plan) => (
            <div
              key={plan._id}
              className="border rounded-xl p-4"
            >
              <h2 className="font-bold">
                {plan.name}
              </h2>

              <p>
                {plan.description}
              </p>

              <p>
                Duration:
                {plan.durationMonths}
                months
              </p>

              <p>
                Price: ₹
                {plan.baseMonthlyPrice}
              </p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}