import { NextRequest } from "next/server";

import { connectToDatabase } from "@/lib/db";

import { subscriptionService } from "@/services/subscription.service";

export async function GET(
  request: NextRequest
) {
  try {
    await connectToDatabase();

    const userId =
      request.nextUrl.searchParams.get(
        "userId"
      );

    if (!userId) {
      return Response.json(
        {
          success: false,
          message:
            "userId is required",
        },
        {
          status: 400,
        }
      );
    }

    const subscriptions =
      await subscriptionService.getSubscriptionsByUser(
        userId
      );

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