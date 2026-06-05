import { connectToDatabase } from "@/lib/db";

import { dashboardService } from "@/services/dashboard.service";

export async function GET() {
  try {
    await connectToDatabase();

    const stats =
      await dashboardService.getStats();

    return Response.json({
      success: true,
      stats,
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