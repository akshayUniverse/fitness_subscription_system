import { connectToDatabase } from "@/lib/db";

import { couponService } from "@/services/coupon.service";

export async function GET() {
  try {
    await connectToDatabase();

    const coupons =
      await couponService.getCoupons();

    return Response.json({
      success: true,
      coupons,
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
      code,
      type,
      value,
      expiryDate,
    } = body;

    if (
      !code ||
      !type ||
      !value ||
      !expiryDate
    ) {
      return Response.json(
        {
          success: false,
          message:
            "code, type, value and expiryDate are required",
        },
        { status: 400 }
      );
    }

    const coupon =
      await couponService.createCoupon(
        {
          code,
          type,
          value,
          expiryDate,
        }
      );

    return Response.json({
      success: true,
      coupon,
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