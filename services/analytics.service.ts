import Subscription from "@/models/Subscription";
import Transaction, { PaymentStatus } from "@/models/Transaction";

export const analyticsService = {
  async getRevenueAnalytics() {
    const revenue = await Transaction.aggregate([
      {
        $group: {
          _id: {
            year: {
              $year: "$paymentDate",
            },
            month: {
              $month: "$paymentDate",
            },
          },
          revenue: {
            $sum: "$amountPaid",
          },
          transactions: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1,
        },
      },
    ]);

    return revenue;
  },
  async getRecentTransactions() {
    return Transaction.find()
      .sort({
        createdAt: -1,
      })
      .limit(10);
  },
  async getRecentSubscriptions() {
    return Subscription.find()
      .populate("userId")
      .populate("planId")
      .sort({
        createdAt: -1,
      })
      .limit(10);
  },
  async getTransactionSummary() {
    const totalTransactions = await Transaction.countDocuments();

    const completedPayments = await Transaction.countDocuments({
      paymentStatus: PaymentStatus.COMPLETED,
    });

    const partialPayments = await Transaction.countDocuments({
      paymentStatus: PaymentStatus.PARTIAL,
    });

    const revenue = await Transaction.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: {
            $sum: "$amountPaid",
          },
        },
      },
    ]);

    return {
      totalTransactions,
      completedPayments,
      partialPayments,
      revenue: revenue[0]?.totalRevenue || 0,
    };
  },
  async getPlanAnalytics() {
    return Subscription.aggregate([
      {
        $group: {
          _id: "$planId",
          subscriptions: {
            $sum: 1,
          },
        },
      },
      {
        $lookup: {
          from: "subscriptionplans",
          localField: "_id",
          foreignField: "_id",
          as: "plan",
        },
      },
      {
        $unwind: "$plan",
      },
      {
        $project: {
          _id: 0,
          planName: "$plan.name",
          subscriptions: 1,
        },
      },
    ]);
  },
};
