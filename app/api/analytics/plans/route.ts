import { connectToDatabase } from "@/lib/db";

import { analyticsService } from "@/services/analytics.service";

export async function GET() {
  try {
    await connectToDatabase();

    const plans =
      await analyticsService.getPlanAnalytics();

    return Response.json({
      success: true,
      plans,
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