import { NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/db";

import { couponService } from "@/services/coupon.service";
import Coupon from "@/models/Coupon";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    const code = req.nextUrl.searchParams.get("code");

    // If code is provided, get single coupon by code
    if (code) {
      const coupon = await Coupon.findOne({
        code: code.toUpperCase(),
        isActive: true,
      });

      if (!coupon) {
        return Response.json(
          {
            success: false,
            message: "Coupon not found or expired",
          },
          { status: 404 }
        );
      }

      if (coupon.expiryDate < new Date()) {
        return Response.json(
          {
            success: false,
            message: "Coupon has expired",
          },
          { status: 400 }
        );
      }

      return Response.json({
        success: true,
        coupon,
      });
    }

    // Otherwise get all coupons
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