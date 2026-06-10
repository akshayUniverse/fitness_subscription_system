import { NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { analyticsService } from "@/services/analytics.service";

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const userId = request.nextUrl.searchParams.get("userId");
    const planId = request.nextUrl.searchParams.get("planId");
    const status = request.nextUrl.searchParams.get("status");
    const dateFromStr = request.nextUrl.searchParams.get("dateFrom");
    const dateToStr = request.nextUrl.searchParams.get("dateTo");

    const dateFrom = dateFromStr ? new Date(dateFromStr) : undefined;
    const dateTo = dateToStr ? new Date(dateToStr) : undefined;

    const transactions = await analyticsService.getTransactionsByFilters(
      userId || undefined,
      planId || undefined,
      status || undefined,
      dateFrom,
      dateTo
    );

    return Response.json({
      success: true,
      transactions,
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
