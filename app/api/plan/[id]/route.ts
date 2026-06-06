import { NextResponse } from "next/server";
import mongoose from "mongoose";

import { connectToDatabase } from "@/lib/db";
import SubscriptionPlan from "@/models/SubscriptionPlan";

export async function PUT(
  req: Request,
  {
    params,
  }: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  try {
    await connectToDatabase();

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid plan id",
        },
        { status: 400 }
      );
    }

    const body = await req.json();

    const plan = await SubscriptionPlan.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!plan) {
      return NextResponse.json(
        {
          success: false,
          message: "Plan not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      plan,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update plan",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: Request,
  {
    params,
  }: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  try {
    await connectToDatabase();

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid plan id",
        },
        { status: 400 }
      );
    }

    const plan = await SubscriptionPlan.findByIdAndDelete(id);

    if (!plan) {
      return NextResponse.json(
        {
          success: false,
          message: "Plan not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete plan",
      },
      { status: 500 }
    );
  }
}
