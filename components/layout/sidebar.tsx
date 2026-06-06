"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, CreditCard, LayoutDashboard, Receipt, Tags } from "lucide-react";
import { UserButton } from "@clerk/nextjs";

import { cn } from "@/lib/utils";

const adminLinks = [
  {
    href: "/admin/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/admin/plans",
    label: "Plans",
    icon: CreditCard,
  },
  {
    href: "/admin/coupons",
    label: "Coupons",
    icon: Tags,
  },
  {
    href: "/admin/transactions",
    label: "Transactions",
    icon: Receipt,
  },
  {
    href: "/admin/subscriptions",
    label: "Subscriptions",
    icon: BarChart3,
  },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-white/10 bg-slate-950 px-4 py-5 lg:block">
        <Link href="/admin/dashboard" className="block rounded-lg px-3 py-2">
          <p className="text-sm font-semibold text-white">Fitness Admin</p>
          <p className="mt-1 text-xs text-slate-400">Subscription operations</p>
        </Link>

        <nav className="mt-8 space-y-1">
          {adminLinks.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-400 transition hover:bg-white/10 hover:text-white",
                  active && "bg-white text-slate-950 hover:bg-white hover:text-slate-950"
                )}
              >
                <Icon className="size-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 px-4 py-3 text-slate-950 shadow-sm backdrop-blur lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-slate-900 lg:hidden">Fitness Admin</p>
              <p className="hidden text-sm text-slate-500 lg:block">Admin workspace</p>
            </div>

            <nav className="flex gap-2 overflow-x-auto lg:hidden">
              {adminLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "whitespace-nowrap rounded-full border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600",
                    pathname === item.href && "border-slate-900 bg-slate-900 text-white"
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <UserButton />
          </div>
        </header>

        <main className="min-h-[calc(100vh-57px)] bg-slate-50 text-slate-950">{children}</main>
      </div>
    </div>
  );
}
