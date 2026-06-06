import mongoose from "mongoose";

import { connectToDatabase } from "@/lib/db";
import Coupon from "@/models/Coupon";

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
      return Response.json(
        {
          success: false,
          message: "Invalid coupon id",
        },
        { status: 400 }
      );
    }

    const body = await req.json();

    if (body.code) {
      body.code = body.code.toUpperCase();
    }

    const coupon = await Coupon.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!coupon) {
      return Response.json(
        {
          success: false,
          message: "Coupon not found",
        },
        { status: 404 }
      );
    }

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
            : "Failed to update coupon",
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
      return Response.json(
        {
          success: false,
          message: "Invalid coupon id",
        },
        { status: 400 }
      );
    }

    const coupon = await Coupon.findByIdAndDelete(id);

    if (!coupon) {
      return Response.json(
        {
          success: false,
          message: "Coupon not found",
        },
        { status: 404 }
      );
    }

    return Response.json({
      success: true,
    });
  } catch (error) {
    return Response.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to delete coupon",
      },
      { status: 500 }
    );
  }
}
