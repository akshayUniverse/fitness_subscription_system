import { NextResponse } from "next/server";

import { connectToDatabase } from "@/lib/db";
import SubscriptionPlan from "@/models/SubscriptionPlan";

export async function GET() {
  try {
    await connectToDatabase();

    const plans = await SubscriptionPlan.find()
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      plans,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch plans",
      },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await connectToDatabase();

    const body = await req.json();

    const plan =
      await SubscriptionPlan.create(body);

    return NextResponse.json(
      {
        success: true,
        plan,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create plan",
      },
      { status: 500 }
    );
  }
}