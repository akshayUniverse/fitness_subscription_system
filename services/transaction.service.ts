import Transaction from "@/models/Transaction";
import Subscription from "@/models/Subscription";

export const transactionService = {
  async recordPayment(
    subscriptionId: string,
    amountPaid: number
  ) {
    const subscription =
      await Subscription.findById(
        subscriptionId
      );

    if (!subscription) {
      throw new Error(
        "Subscription not found"
      );
    }

    const newPaidAmount =
      subscription.paidAmount +
      amountPaid;

    const remainingBalance =
      subscription.totalAmount -
      newPaidAmount;

    const paymentStatus =
      remainingBalance <= 0
        ? "COMPLETED"
        : "PARTIAL";

    const invoiceNumber =
      `INV-${Date.now()}`;

    const transaction =
      await Transaction.create({
        userId:
          subscription.userId,

        subscriptionId,

        invoiceNumber,

        totalAmount:
          subscription.totalAmount,

        amountPaid,

        remainingBalance,

        paymentStatus,
      });

    subscription.paidAmount =
      newPaidAmount;

    subscription.balanceDue =
      remainingBalance;

    if (
      remainingBalance <= 0
    ) {
      subscription.status =
        "COMPLETED";
    }

    await subscription.save();

    return transaction;
  },

  async getTransactionsBySubscription(
    subscriptionId: string
  ) {
    return Transaction.find({
      subscriptionId,
    }).sort({
      createdAt: -1,
    });
  },
};