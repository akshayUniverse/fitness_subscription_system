import Coupon from "@/models/Coupon";

export const couponService = {
  async createCoupon(data: {
    code: string;
    type: string;
    value: number;
    expiryDate: string;
  }) {
    const existingCoupon =
      await Coupon.findOne({
        code: data.code.toUpperCase(),
      });

    if (existingCoupon) {
      throw new Error(
        "Coupon already exists"
      );
    }

    return Coupon.create({
      code: data.code.toUpperCase(),
      type: data.type,
      value: data.value,
      expiryDate: data.expiryDate,
    });
  },

  async getCoupons() {
    return Coupon.find().sort({
      createdAt: -1,
    });
  },

  async validateCoupon(
    code: string
  ) {
    const coupon =
      await Coupon.findOne({
        code: code.toUpperCase(),
        isActive: true,
      });

    if (!coupon) {
      throw new Error(
        "Coupon not found"
      );
    }

    if (
      new Date(coupon.expiryDate) <
      new Date()
    ) {
      throw new Error(
        "Coupon expired"
      );
    }

    return coupon;
  },
};