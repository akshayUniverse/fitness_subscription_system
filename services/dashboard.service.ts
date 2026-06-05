import User from "@/models/User";
import Subscription from "@/models/Subscription";
import Transaction from "@/models/Transaction";

export const dashboardService = {
  async getStats() {
    const totalUsers =
      await User.countDocuments();

    const totalSubscriptions =
      await Subscription.countDocuments();

    const activeSubscriptions =
      await Subscription.countDocuments({
        status: "ACTIVE",
      });

    const totalRevenue =
      await Transaction.aggregate([
        {
          $group: {
            _id: null,
            total: {
              $sum: "$amountPaid",
            },
          },
        },
      ]);

    return {
      totalUsers,
      totalSubscriptions,
      activeSubscriptions,
      totalRevenue:
        totalRevenue[0]?.total || 0,
    };
  },
};