"use client";

import { useEffect } from "react";

export default function RedirectPage() {
  useEffect(() => {
    async function redirectUser() {
      const res = await fetch("/api/user/me");
      const data = await res.json();

      if (data.user?.role === "ADMIN") {
        window.location.replace("/admin/dashboard");
      } else {
        window.location.replace("/dashboard");
      }
    }

    redirectUser();
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center">
      Redirecting...
    </div>
  );
}