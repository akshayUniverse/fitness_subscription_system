"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { CreditCard, LayoutDashboard, Zap } from "lucide-react";

import { cn } from "@/lib/utils";

const userLinks = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/plans",
    label: "Plans",
    icon: Zap,
  },
  {
    href: "/billing",
    label: "Billing",
    icon: CreditCard,
  },
];

export function UserShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 px-4 py-3 shadow-sm backdrop-blur sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <Link href="/dashboard" className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-950 sm:text-base">
              Fitness Subscription
            </p>
            <p className="hidden text-xs text-slate-500 sm:block">Member portal</p>
          </Link>

          <nav className="flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 p-1">
            {userLinks.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:text-slate-950",
                    active && "bg-white text-slate-950 shadow-sm"
                  )}
                >
                  <Icon className="size-3.5" />
                  <span className="hidden sm:inline">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <UserButton />
        </div>
      </header>

      {children}
    </main>
  );
}
