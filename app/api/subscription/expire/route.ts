import { connectToDatabase } from "@/lib/db";

import { dashboardService } from "@/services/dashboard.service";

export async function POST() {
  try {
    await connectToDatabase();

    const result =
      await dashboardService.updateExpiredSubscriptions();

    return Response.json({
      success: true,
      result,
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