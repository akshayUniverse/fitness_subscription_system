import { NextRequest } from "next/server";

import { connectToDatabase } from "@/lib/db";

import { transactionService } from "@/services/transaction.service";

export async function GET(
  request: NextRequest
) {
  try {
    await connectToDatabase();

    const subscriptionId =
      request.nextUrl.searchParams.get(
        "subscriptionId"
      );

    if (!subscriptionId) {
      return Response.json(
        {
          success: false,
          message:
            "subscriptionId is required",
        },
        { status: 400 }
      );
    }

    const transactions =
      await transactionService.getTransactionsBySubscription(
        subscriptionId
      );

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
      { status: 500 }
    );
  }
}

export async function POST(
  req: Request
) {
  try {
    await connectToDatabase();

    const body = await req.json();

    const {
      subscriptionId,
      amountPaid,
    } = body;

    if (
      !subscriptionId ||
      !amountPaid
    ) {
      return Response.json(
        {
          success: false,
          message:
            "subscriptionId and amountPaid are required",
        },
        { status: 400 }
      );
    }

    const transaction =
      await transactionService.createTransaction(
        subscriptionId,
        amountPaid
      );

    return Response.json({
      success: true,
      transaction,
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
      { status: 500 }
    );
  }
}