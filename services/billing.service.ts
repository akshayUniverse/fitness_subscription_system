import Subscription, { SubscriptionStatus } from "@/models/Subscription";
import Transaction from "@/models/Transaction";

export const billingService = {
  async processPartialPayment(
    subscriptionId: string,
    amountPaid: number,
    invoiceNumber: string
  ) {
    const subscription = await Subscription.findById(subscriptionId);

    if (!subscription) {
      throw new Error("Subscription not found");
    }

    if (subscription.status === SubscriptionStatus.COMPLETED) {
      throw new Error("Subscription is already paid");
    }

    if (amountPaid <= 0) {
      throw new Error("Payment amount must be greater than 0");
    }

    const remainingBalance = Math.max(
      subscription.balanceDue - amountPaid,
      0
    );

    // Create transaction record
    const transaction = await Transaction.create({
      subscriptionId,
      amountPaid,
      remainingBalance,
      invoiceNumber,
      paymentStatus: remainingBalance === 0 ? "COMPLETED" : "PARTIAL",
    });

    // Update subscription
    subscription.paidAmount += amountPaid;
    subscription.balanceDue = remainingBalance;

    if (remainingBalance === 0) {
      subscription.status = SubscriptionStatus.COMPLETED;
    } else if (subscription.status === SubscriptionStatus.PENDING) {
      subscription.status = SubscriptionStatus.ACTIVE;
    }

    await subscription.save();

    return {
      subscription,
      transaction,
    };
  },

  async processFullPayment(
    subscriptionId: string,
    invoiceNumber: string
  ) {
    const subscription = await Subscription.findById(subscriptionId);

    if (!subscription) {
      throw new Error("Subscription not found");
    }

    if (subscription.status === SubscriptionStatus.COMPLETED) {
      throw new Error("Subscription is already paid");
    }

    const amountPaid = subscription.totalAmount;

    // Create transaction record
    const transaction = await Transaction.create({
      subscriptionId,
      amountPaid,
      remainingBalance: 0,
      invoiceNumber,
      paymentStatus: "COMPLETED",
    });

    // Update subscription
    subscription.paidAmount = subscription.totalAmount;
    subscription.balanceDue = 0;
    subscription.status = SubscriptionStatus.COMPLETED;

    await subscription.save();

    return {
      subscription,
      transaction,
    };
  },

  async generateInvoiceNumber(): Promise<string> {
    const now = new Date();
    const timestamp = now.getTime();
    return `INV-${timestamp}`;
  },

  async getSubscriptionBillingStatus(subscriptionId: string) {
    const subscription = await Subscription.findById(subscriptionId);

    if (!subscription) {
      throw new Error("Subscription not found");
    }

    const progress = subscription.totalAmount > 0
      ? Math.min((subscription.paidAmount / subscription.totalAmount) * 100, 100)
      : 0;

    return {
      subscription,
      progress,
      isPaid: subscription.balanceDue === 0,
      isPartiallyPaid: subscription.paidAmount > 0 && subscription.balanceDue > 0,
    };
  },
};

