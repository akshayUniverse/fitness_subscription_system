import { Schema, model, models, Types } from "mongoose";

export enum PaymentType {
  FULL = "FULL",
  PARTIAL = "PARTIAL",
}

export enum SubscriptionStatus {
  PENDING = "PENDING",
  ACTIVE = "ACTIVE",
  COMPLETED = "COMPLETED",
  EXPIRED = "EXPIRED",
}

const SubscriptionSchema = new Schema(
  {
    userId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },

    planId: {
      type: Types.ObjectId,
      ref: "SubscriptionPlan",
      required: true,
    },

    couponId: {
      type: Types.ObjectId,
      ref: "Coupon",
      default: null,
    },

    planSnapshot: {
      type: Object,
      required: true,
    },

    couponSnapshot: {
      type: Object,
      default: null,
    },

    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
      required: true,
    },

    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    paidAmount: {
      type: Number,
      default: 0,
      min: 0,
    },

    balanceDue: {
      type: Number,
      required: true,
      min: 0,
    },

    paymentType: {
      type: String,
      enum: Object.values(PaymentType),
      required: true,
    },

    status: {
      type: String,
      enum: Object.values(SubscriptionStatus),
      default: SubscriptionStatus.PENDING,
    },
  },
  {
    timestamps: true,
  }
);

const Subscription =
  models.Subscription ||
  model("Subscription", SubscriptionSchema);

export default Subscription;