import Subscription, { SubscriptionStatus } from "@/models/Subscription";

import Transaction, { PaymentStatus } from "@/models/Transaction";

export const transactionService = {
  async createTransaction(subscriptionId: string, amountPaid: number) {
    const subscription = await Subscription.findById(subscriptionId);

    if (!subscription) {
      throw new Error("Subscription not found");
    }

    const newPaidAmount = subscription.paidAmount + amountPaid;

    const remainingBalance = subscription.totalAmount - newPaidAmount;

    const paymentStatus =
      remainingBalance <= 0 ? PaymentStatus.COMPLETED : PaymentStatus.PARTIAL;

    const invoiceNumber = `INV-${Date.now()}`;

    const transaction = await Transaction.create({
      userId: subscription.userId,
      subscriptionId,
      invoiceNumber,
      totalAmount: subscription.totalAmount,
      amountPaid,
      remainingBalance: Math.max(remainingBalance, 0),
      paymentStatus,
    });

    subscription.paidAmount = newPaidAmount;

    subscription.balanceDue = Math.max(remainingBalance, 0);

    if (subscription.balanceDue === 0) {
      subscription.status = SubscriptionStatus.ACTIVE;
    } else {
      subscription.status = SubscriptionStatus.PENDING;
    }

    await subscription.save();

    return transaction;
  },

  async getTransactionsBySubscription(subscriptionId: string) {
    return Transaction.find({
      subscriptionId,
    }).sort({
      createdAt: -1,
    });
  },
  async getTransactionsByUser(userId: string) {
    return Transaction.find({
      userId,
    })
      .populate("subscriptionId")
      .sort({
        paymentDate: -1,
      });
  },
  async getTransactionsWithFilters(
    userId?: string,
    subscriptionId?: string,
    status?: string
  ) {
    const filter: any = {};

    if (userId) {
      filter.userId = userId;
    }

    if (subscriptionId) {
      filter.subscriptionId = subscriptionId;
    }

    if (status) {
      filter.paymentStatus = status;
    }

    return Transaction.find(filter)
      .populate("userId")
      .populate("subscriptionId")
      .sort({
        paymentDate: -1,
      });
  },
};
