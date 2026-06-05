import Transaction from "@/models/Transaction";
import Subscription from "@/models/Subscription";

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
};
