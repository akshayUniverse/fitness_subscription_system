import User from "@/models/User";
import Subscription, {
  SubscriptionStatus,
} from "@/models/Subscription";
import Transaction from "@/models/Transaction";

export const dashboardService = {
  async getStats() {
    const totalUsers =
      await User.countDocuments();

    const totalSubscriptions =
      await Subscription.countDocuments();

    const activeSubscriptions =
      await Subscription.countDocuments({
        status:
          SubscriptionStatus.ACTIVE,
      });

    const revenueResult =
      await Transaction.aggregate([
        {
          $group: {
            _id: null,
            totalRevenue: {
              $sum: "$amountPaid",
            },
          },
        },
      ]);

    const totalRevenue =
      revenueResult[0]?.totalRevenue || 0;

    return {
      totalUsers,
      totalSubscriptions,
      activeSubscriptions,
      totalRevenue,
    };
  },

  async updateExpiredSubscriptions() {
    const today = new Date();

    const result =
      await Subscription.updateMany(
        {
          endDate: {
            $lt: today,
          },
          status:
            SubscriptionStatus.ACTIVE,
        },
        {
          status:
            SubscriptionStatus.EXPIRED,
        }
      );

    return result;
  },
};