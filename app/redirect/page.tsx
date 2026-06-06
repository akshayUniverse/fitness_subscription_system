import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { connectToDatabase } from "@/lib/db";
import User, { UserRole } from "@/models/User";

async function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default async function RedirectPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  await connectToDatabase();

  let user = null;

  for (let i = 0; i < 10; i++) {
    user = await User.findOne({
      clerkId: userId,
    }).select("role");

    if (user) break;

    await wait(500);
  }

  if (!user) {
    redirect("/dashboard");
  }

  if (user.role === UserRole.ADMIN) {
    redirect("/admin/dashboard");
  }

  redirect("/dashboard");
}