import { NextRequest } from "next/server";

import { connectToDatabase } from "@/lib/db";

import Transaction from "@/models/Transaction";

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
          message: "userId required",
        },
        { status: 400 }
      );
    }

    const transactions =
      await Transaction.find({
        userId,
      }).sort({
        createdAt: -1,
      });

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