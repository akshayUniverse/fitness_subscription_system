import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";

export async function GET() {
  try {
    await connectToDatabase();

    const existingUser = await User.findOne({
      clerkId: "test_clerk_id",
    });

    if (existingUser) {
      return NextResponse.json({
        success: true,
        message: "Test user already exists",
        user: existingUser,
      });
    }

    const user = await User.create({
      clerkId: "test_clerk_id",
      email: "test@example.com",
      name: "Test User",
    });

    return NextResponse.json({
      success: true,
      message: "Test user created",
      user,
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