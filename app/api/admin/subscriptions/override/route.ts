import { connectToDatabase } from "@/lib/db";
import Subscription, { SubscriptionStatus } from "@/models/Subscription";
import Transaction, { PaymentStatus } from "@/models/Transaction";

export async function POST(request: Request) {
  try {
    await connectToDatabase();

    const body = await request.json();
    const { subscriptionId } = body;

    if (!subscriptionId) {
      return Response.json(
        {
          success: false,
          message: "subscriptionId is required",
        },
        { status: 400 }
      );
    }

    const subscription = await Subscription.findById(subscriptionId);

    if (!subscription) {
      return Response.json(
        {
          success: false,
          message: "Subscription not found",
        },
        { status: 404 }
      );
    }

    const previousBalanceDue = subscription.balanceDue;

    subscription.paidAmount = subscription.totalAmount;
    subscription.balanceDue = 0;
    subscription.status = SubscriptionStatus.ACTIVE;

    await subscription.save();

    const auditTransaction = await Transaction.create({
      userId: subscription.userId,
      subscriptionId: subscription._id,
      invoiceNumber: `ADM-OVERRIDE-${Date.now()}`,
      totalAmount: subscription.totalAmount,
      amountPaid: previousBalanceDue,
      remainingBalance: 0,
      paymentStatus: PaymentStatus.COMPLETED,
    });

    return Response.json({
      success: true,
      subscription,
      auditTransaction,
      message: "Subscription marked as completed",
    });
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
