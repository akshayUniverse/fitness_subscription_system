import Subscription from "@/models/Subscription";
import SubscriptionPlan from "@/models/SubscriptionPlan";
import User from "@/models/User";
import Coupon, { CouponType } from "@/models/Coupon";

import { SubscriptionStatus } from "@/models/Subscription";

export const subscriptionService = {
  async createSubscription(
    userId: string,
    planId: string,
    couponCode?: string,
    paymentType: "FULL" | "PARTIAL" = "FULL",
  ) {
    const user = await User.findById(userId);
    const existingSubscription = await Subscription.findOne({
      userId,
      planId,
      status: {
        $in: ["PENDING", "ACTIVE"],
      },
    });

    if (existingSubscription) {
      throw new Error("You already have an active subscription for this plan");
    }

    if (!user) {
      throw new Error("User not found");
    }

    const plan = await SubscriptionPlan.findById(planId);

    if (!plan) {
      throw new Error("Plan not found");
    }

    if (paymentType === "PARTIAL" && !plan.allowPartialPayment) {
      throw new Error("This plan does not support partial payment");
    }

    const startDate = new Date();

    const endDate = new Date();

    endDate.setMonth(endDate.getMonth() + plan.durationMonths);

    const originalAmount = plan.baseMonthlyPrice * plan.durationMonths;

    let totalAmount = originalAmount;

    if (plan.discountPercentage) {
      totalAmount = totalAmount * (1 - plan.discountPercentage / 100);
    }

    let couponId = null;

    let couponSnapshot = null;
    if (couponCode) {
      const coupon = await Coupon.findOne({
        code: couponCode.toUpperCase(),
        isActive: true,
      });

      if (!coupon) {
        throw new Error("Invalid coupon");
      }

      if (coupon.expiryDate < new Date()) {
        throw new Error("Coupon expired");
      }

      let discount = 0;

      if (coupon.type === CouponType.PERCENTAGE) {
        discount = (totalAmount * coupon.value) / 100;
      } else {
        discount = coupon.value;
      }

      totalAmount = Math.max(originalAmount - discount, 0);

      couponId = coupon._id;

      couponSnapshot = {
        code: coupon.code,
        type: coupon.type,
        value: coupon.value,
      };
    }

    const planSnapshot = {
      name: plan.name,
      description: plan.description,
      durationMonths: plan.durationMonths,
      baseMonthlyPrice: plan.baseMonthlyPrice,
      discountPercentage: plan.discountPercentage,
    };

    const subscription = await Subscription.create({
      userId,
      planId,

      planSnapshot,
      couponId,
      couponSnapshot,

      startDate,
      endDate,

      totalAmount,
      paidAmount: 0,
      balanceDue: totalAmount,

      paymentType: paymentType,

      status: SubscriptionStatus.PENDING,
    });

    user.activeSubscriptionId = subscription._id;

    await user.save();

    return subscription;
  },
  async getSubscriptionByUser(userId: string) {
    const subscriptions = await Subscription.find({
      userId,
    })
      .populate("planId")
      .populate("couponId")
      .sort({
        createdAt: -1,
      });

    for (const sub of subscriptions) {
      const calculatedStatus = this.calculateSubscriptionStatus(sub);

      if (sub.status !== calculatedStatus) {
        sub.status = calculatedStatus as any;
        await sub.save();
      }
    }

    return subscriptions;
  },
  async getSubscriptionById(subscriptionId: string) {
    return Subscription.findById(subscriptionId)
      .populate("userId")
      .populate("planId")
      .populate("couponId");
  },
  async getSubscriptionsByUser(userId: string) {
    return Subscription.find({
      userId,
    })
      .populate("planId")
      .populate("couponId")
      .sort({
        createdAt: -1,
      });
  },
  async getSubscriptionsByStatus(status: string) {
    return Subscription.find({
      status,
    })
      .populate("userId")
      .populate("planId")
      .sort({
        createdAt: -1,
      });
  },
  async getSubscriptionsByUserAndStatus(userId: string, status: string) {
    return Subscription.find({
      userId,
      status,
    })
      .populate("planId")
      .populate("couponId")
      .sort({
        createdAt: -1,
      });
  },
  async updateSubscriptionStatus(subscriptionId: string, newStatus: string) {
    return Subscription.findByIdAndUpdate(
      subscriptionId,
      { status: newStatus },
      { new: true },
    );
  },
  calculateSubscriptionStatus(subscription: any): string {
    const now = new Date();
    const endDate = new Date(subscription.endDate);

    if (subscription.status === SubscriptionStatus.COMPLETED) {
      return SubscriptionStatus.COMPLETED;
    }

    if (endDate < now) {
      return SubscriptionStatus.EXPIRED;
    }

    if (subscription.balanceDue === 0) {
      return SubscriptionStatus.ACTIVE;
    }

    return SubscriptionStatus.PENDING;
  },
};
