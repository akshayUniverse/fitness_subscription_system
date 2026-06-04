"use client";

import Link from "next/link";
import { UserButton } from "@clerk/nextjs";

export default function DashboardPage() {
  return (
    <main className="min-h-screen flex flex-col bg-slate-50">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-900">User Dashboard</h1>
          <div className="flex items-center gap-4">
            <Link href="/billing" className="text-slate-600 hover:text-slate-900">
              Billing
            </Link>
            <UserButton />
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-7xl mx-auto w-full px-8 py-12 flex-1">
        <div className="rounded-3xl border border-slate-200 bg-white p-10 shadow-sm">
          <h2 className="text-3xl font-semibold mb-4">Dashboard</h2>
          <p className="text-sm text-slate-600 mb-6">
            TODO: Build the user dashboard for subscription management and billing overview.
          </p>

          {/* Navigation Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
            <Link
              href="/billing"
              className="p-6 border border-slate-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition"
            >
              <h3 className="font-semibold text-slate-900">View Billing History</h3>
              <p className="text-sm text-slate-600 mt-2">
                Check your invoices and payment records
              </p>
            </Link>
            <div className="p-6 border border-slate-200 rounded-lg opacity-50 cursor-not-allowed">
              <h3 className="font-semibold text-slate-900">Manage Subscription</h3>
              <p className="text-sm text-slate-600 mt-2">
                Coming soon: Upgrade or change your plan
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
