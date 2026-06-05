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
  ) {
    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    const plan = await SubscriptionPlan.findById(planId);

    if (!plan) {
      throw new Error("Plan not found");
    }

    const startDate = new Date();

    const endDate = new Date();

    endDate.setMonth(endDate.getMonth() + plan.durationMonths);

    const originalAmount = plan.baseMonthlyPrice * plan.durationMonths;

    let totalAmount = originalAmount;

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
        discount = (originalAmount * coupon.value) / 100;
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

      paymentType: plan.allowPartialPayment ? "PARTIAL" : "FULL",

      status: SubscriptionStatus.PENDING,
    });

    user.activeSubscriptionId = subscription._id;

    await user.save();

    return subscription;
  },
  async getSubscriptionByUser(userId: string) {
    return Subscription.findOne({
      userId,
    })
      .populate("planId")
      .populate("userId");
  },
  async getSubscriptionById(
  subscriptionId: string
) {
  return Subscription.findById(
    subscriptionId
  )
    .populate("userId")
    .populate("planId")
    .populate("couponId");
},
async getSubscriptionsByUser(
  userId: string
) {
  return Subscription.find({
    userId,
  })
    .populate("planId")
    .populate("couponId")
    .sort({
      createdAt: -1,
    });
},
};
