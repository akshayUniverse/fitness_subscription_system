import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import SubscriptionPlan from "@/models/SubscriptionPlan";

export async function GET() {
  try {
    await connectToDatabase();

    const existingPlan = await SubscriptionPlan.findOne({
      name: "Premium Plan",
    });

    if (existingPlan) {
      return NextResponse.json({
        success: true,
        message: "Plan already exists",
        plan: existingPlan,
      });
    }

    const plan = await SubscriptionPlan.create({
      name: "Premium Plan",
      description: "Full gym access and trainer support",
      durationMonths: 12,
      baseMonthlyPrice: 1000,
      discountPercentage: 10,
      allowPartialPayment: true,
    });

    return NextResponse.json({
      success: true,
      message: "Plan created",
      plan,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error: String(error),
      },
      {
        status: 500,
      }
    );
  }
}