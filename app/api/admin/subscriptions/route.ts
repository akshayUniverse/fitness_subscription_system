import { connectToDatabase } from "@/lib/db";
import Subscription from "@/models/Subscription";

import "@/models/User";
import "@/models/SubscriptionPlan";

export async function GET() {
  try {
    await connectToDatabase();

    const subscriptions = await Subscription.find()
      .populate({
        path: "userId",
        select: "name email",
      })
      .populate({
        path: "planId",
        select: "name",
      })
      .sort({
        createdAt: -1,
      });
    console.log(subscriptions.filter((s) => !s.userId || !s.planId));

    return Response.json({
      success: true,
      subscriptions,
    });
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Unknown error",
      },
      {
        status: 500,
      },
    );
  }
}
