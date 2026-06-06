"use client";

import Link from "next/link";
import { useAuth, UserButton } from "@clerk/nextjs";

export default function HomePage() {
  const { isSignedIn } = useAuth();

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header with Auth UI */}
        <div className="flex items-center justify-between mb-12">
          <h1 className="text-2xl font-bold text-slate-900">
            Fitness Subscription System
          </h1>
          <div className="flex items-center gap-4">
            {isSignedIn ? (
              <>
                <Link
                  href="/redirect"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Dashboard
                </Link>
                <UserButton />
              </>
            ) : (
              <>
                <Link
                  href="/sign-in"
                  className="px-4 py-2 text-slate-600 hover:text-slate-900 transition"
                >
                  Sign In
                </Link>
                <Link
                  href="/sign-up"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Hero Section */}
        <div className="rounded-3xl border border-slate-200 bg-white p-12 shadow-sm">
          <h2 className="text-4xl font-semibold text-slate-900 mb-4">
            Manage Your Fitness Subscription
          </h2>
          <p className="text-lg text-slate-600 mb-8">
            A modern platform for managing subscriptions, billing, and fitness plans.
          </p>

          {!isSignedIn ? (
            <div className="flex gap-4 flex-wrap">
              <Link
                href="/sign-up"
                className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
              >
                Get Started
              </Link>
              <Link
                href="/about"
                className="px-6 py-3 border border-slate-300 text-slate-900 font-medium rounded-lg hover:bg-slate-50 transition"
              >
                Learn More
              </Link>
            </div>
          ) : (
            <div className="flex gap-4 flex-wrap">
              <Link
                href="/redirect"
                className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
              >
                Go to Dashboard
              </Link>
              <Link
                href="/billing"
                className="px-6 py-3 border border-slate-300 text-slate-900 font-medium rounded-lg hover:bg-slate-50 transition"
              >
                View Billing
              </Link>
            </div>
          )}
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {[
            {
              title: "Dynamic Pricing",
              description: "Choose from flexible plans tailored to your needs",
            },
            {
              title: "Flexible Payments",
              description: "Pay in full or split your payments across installments",
            },
            {
              title: "Transparent Billing",
              description: "View detailed billing history and invoices anytime",
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-slate-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
