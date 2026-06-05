"use client";

import { useEffect, useState } from "react";

interface Subscription {
  _id: string;
  totalAmount: number;
  balanceDue: number;
  status: string;
  endDate: string;

  userId: {
    name: string;
    email: string;
  };

  planId: {
    name: string;
  };
}

export default function AdminSubscriptionsPage() {
  const [
    subscriptions,
    setSubscriptions,
  ] = useState<
    Subscription[]
  >([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  useEffect(() => {
    async function loadData() {
      const response =
        await fetch(
          "/api/admin/subscriptions"
        );

      const data =
        await response.json();

      setSubscriptions(
        data.subscriptions || []
      );

      setLoading(false);
    }

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="p-8">
        Loading...
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">
        Subscriptions
      </h1>

      <div className="overflow-x-auto rounded-xl border bg-white">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-slate-50">
              <th className="p-4 text-left">
                Member
              </th>

              <th className="p-4 text-left">
                Plan
              </th>

              <th className="p-4 text-left">
                Status
              </th>

              <th className="p-4 text-left">
                Amount
              </th>

              <th className="p-4 text-left">
                Balance
              </th>

              <th className="p-4 text-left">
                End Date
              </th>
            </tr>
          </thead>

          <tbody>
            {subscriptions.map(
              (subscription) => (
                <tr
                  key={subscription._id}
                  className="border-b"
                >
                  <td className="p-4">
                    {
                      subscription
                        .userId?.name
                    }
                  </td>

                  <td className="p-4">
                    {
                      subscription
                        .planId?.name
                    }
                  </td>

                  <td className="p-4">
                    {
                      subscription.status
                    }
                  </td>

                  <td className="p-4">
                    ₹
                    {
                      subscription.totalAmount
                    }
                  </td>

                  <td className="p-4">
                    ₹
                    {
                      subscription.balanceDue
                    }
                  </td>

                  <td className="p-4">
                    {new Date(
                      subscription.endDate
                    ).toLocaleDateString()}
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}