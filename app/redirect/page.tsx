import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { connectToDatabase } from "@/lib/db";
import User, { UserRole } from "@/models/User";

export default async function RedirectPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  await connectToDatabase();

  const user = await User.findOne({
    clerkId: userId,
  }).select("role");

  if (user?.role === UserRole.ADMIN) {
    redirect("/admin/dashboard");
  }

  redirect("/dashboard");
}
