import Subscription from "@/models/Subscription";
import SubscriptionPlan from "@/models/SubscriptionPlan";
import User from "@/models/User";

export const subscriptionService = {
  async createSubscription(
    userId: string,
    planId: string
  ) {
    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    const plan =
      await SubscriptionPlan.findById(planId);

    if (!plan) {
      throw new Error("Plan not found");
    }

    const startDate = new Date();

    const endDate = new Date();

    endDate.setMonth(
      endDate.getMonth() +
        plan.durationMonths
    );

    const subscription =
      await Subscription.create({
        userId,
        planId,
        startDate,
        endDate,
        status: "ACTIVE",
      });

    user.activeSubscriptionId =
      subscription._id;

    await user.save();

    return subscription;
  },

  async getSubscriptionByUser(
    userId: string
  ) {
    return Subscription.findOne({
      userId,
    })
      .populate("planId")
      .populate("userId");
  },
};