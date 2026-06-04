import { Schema, model, models } from "mongoose";

const SubscriptionPlanSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    durationMonths: {
      type: Number,
      required: true,
      min: 1,
    },

    baseMonthlyPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    discountPercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    allowPartialPayment: {
      type: Boolean,
      default: false,
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

const SubscriptionPlan =
  models.SubscriptionPlan ||
  model("SubscriptionPlan", SubscriptionPlanSchema);

export default SubscriptionPlan;