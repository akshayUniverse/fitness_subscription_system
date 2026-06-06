import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <section className="mx-auto max-w-5xl px-8 py-16">
        <Link href="/" className="text-sm font-medium text-blue-600 hover:text-blue-700">
          Back to home
        </Link>

        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="text-4xl font-bold text-slate-900">About Fitness Subscription System</h1>

          <p className="mt-4 text-lg text-slate-600">
            This platform helps fitness businesses manage membership plans, subscription billing,
            coupons, transactions, and plan discovery from one dashboard.
          </p>

          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-xl border border-slate-200 p-4">
              <h2 className="font-semibold text-slate-900">Flexible Plans</h2>
              <p className="mt-2 text-sm text-slate-600">
                Admins can create full-payment or partial-payment plans for different durations.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 p-4">
              <h2 className="font-semibold text-slate-900">Billing Records</h2>
              <p className="mt-2 text-sm text-slate-600">
                Members can review payment history, balances, and subscription details.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 p-4">
              <h2 className="font-semibold text-slate-900">Admin Oversight</h2>
              <p className="mt-2 text-sm text-slate-600">
                Admin screens cover plans, coupons, transactions, subscriptions, and analytics.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
