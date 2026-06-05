import { connectToDatabase } from "@/lib/db";
import Subscription from "@/models/Subscription";

export async function GET() {
  try {
    await connectToDatabase();

    const subscriptions =
      await Subscription.find()
        .populate("userId")
        .populate("planId")
        .sort({
          createdAt: -1,
        });

    return Response.json({
      success: true,
      subscriptions,
    });
  } catch (error) {
    return Response.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Unknown error",
      },
      {
        status: 500,
      }
    );
  }
}