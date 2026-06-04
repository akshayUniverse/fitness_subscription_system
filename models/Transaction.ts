import { Schema, model, models, Types } from "mongoose";

export enum PaymentStatus {
  PARTIAL = "PARTIAL",
  COMPLETED = "COMPLETED",
}

const TransactionSchema = new Schema(
  {
    userId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },

    subscriptionId: {
      type: Types.ObjectId,
      ref: "Subscription",
      required: true,
    },

    invoiceNumber: {
      type: String,
      required: true,
      unique: true,
    },

    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    amountPaid: {
      type: Number,
      required: true,
      min: 0,
    },

    remainingBalance: {
      type: Number,
      required: true,
      min: 0,
    },

    paymentStatus: {
      type: String,
      enum: Object.values(PaymentStatus),
      required: true,
    },

    paymentDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Transaction =
  models.Transaction ||
  model("Transaction", TransactionSchema);

export default Transaction;