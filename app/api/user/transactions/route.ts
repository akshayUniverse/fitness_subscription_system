import { NextRequest } from "next/server";

import { connectToDatabase } from "@/lib/db";
import { transactionService } from "@/services/transaction.service";

export async function GET(
  request: NextRequest
) {
  try {
    await connectToDatabase();

    const userId =
      request.nextUrl.searchParams.get(
        "userId"
      );
    const subscriptionId =
      request.nextUrl.searchParams.get(
        "subscriptionId"
      );
    const status =
      request.nextUrl.searchParams.get(
        "status"
      );

    if (!userId) {
      return Response.json(
        {
          success: false,
          message: "userId required",
        },
        { status: 400 }
      );
    }

    let transactions;

    if (subscriptionId || status) {
      transactions =
        await transactionService.getTransactionsWithFilters(
          userId,
          subscriptionId || undefined,
          status || undefined
        );
    } else {
      transactions =
        await transactionService.getTransactionsByUser(
          userId
        );
    }

    return Response.json({
      success: true,
      transactions,
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