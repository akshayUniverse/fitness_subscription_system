import { connectToDatabase } from "@/lib/db";

import { subscriptionService } from "@/services/subscription.service";

export async function GET(
  request: Request,
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

    const { id } =
      await params;

    const subscription =
      await subscriptionService.getSubscriptionById(
        id
      );

    return Response.json({
      success: true,
      subscription,
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