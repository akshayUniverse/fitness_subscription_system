import { Schema, model, models } from "mongoose";

export enum CouponType {
  PERCENTAGE = "PERCENTAGE",
  FLAT = "FLAT",
}

const CouponSchema = new Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },

    type: {
      type: String,
      enum: Object.values(CouponType),
      required: true,
    },

    value: {
      type: Number,
      required: true,
      min: 1,
    },

    expiryDate: {
      type: Date,
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Coupon =
  models.Coupon ||
  model("Coupon", CouponSchema);

export default Coupon;  