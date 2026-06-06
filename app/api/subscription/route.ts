import { NextRequest } from "next/server";

import { connectToDatabase } from "@/lib/db";
import { subscriptionService } from "@/services/subscription.service";

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const userId = request.nextUrl.searchParams.get("userId");

    if (!userId) {
      return Response.json(
        {
          success: false,
          message: "userId is required",
        },
        { status: 400 },
      );
    }

    const subscription =
      await subscriptionService.getSubscriptionByUser(userId);

    return Response.json({
      success: true,
      subscription,
    });
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    await connectToDatabase();

    const body = await req.json();

    const { userId, planId, couponCode, paymentType } = body;

    if (!userId || !planId) {
      return Response.json(
        {
          success: false,
          message: "userId and planId are required",
        },
        { status: 400 },
      );
    }

    const subscription = await subscriptionService.createSubscription(
      userId,
      planId,
      couponCode,
      paymentType,
    );

    return Response.json({
      success: true,
      subscription,
    });
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
