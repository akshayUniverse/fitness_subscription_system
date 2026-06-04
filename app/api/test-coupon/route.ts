import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Coupon from "@/models/Coupon";

export async function GET() {
  try {
    await connectToDatabase();

    const existingCoupon = await Coupon.findOne({
      code: "WELCOME10",
    });

    if (existingCoupon) {
      return NextResponse.json({
        success: true,
        message: "Coupon already exists",
        coupon: existingCoupon,
      });
    }

    const coupon = await Coupon.create({
      code: "WELCOME10",
      type: "PERCENTAGE",
      value: 10,
      expiryDate: new Date("2027-12-31"),
    });

    return NextResponse.json({
      success: true,
      message: "Coupon created",
      coupon,
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
