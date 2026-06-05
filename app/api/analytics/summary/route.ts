import { connectToDatabase } from "@/lib/db";

import { analyticsService } from "@/services/analytics.service";

export async function GET() {
  try {
    await connectToDatabase();

    const summary =
      await analyticsService.getTransactionSummary();

    return Response.json({
      success: true,
      summary,
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