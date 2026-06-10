import { NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { analyticsService } from "@/services/analytics.service";

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const subscriptionId = request.nextUrl.searchParams.get("subscriptionId");
    const userId = request.nextUrl.searchParams.get("userId");
    const planId = request.nextUrl.searchParams.get("planId");
    const status = request.nextUrl.searchParams.get("status");

    const subscriptions = await analyticsService.getSubscriptionsByFilters(
      status || undefined,
      userId || undefined,
      planId || undefined
    );

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
      { status: 500 }
    );
  }
}
