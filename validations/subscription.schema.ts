import { z } from "zod";

export const subscriptionSchema = z.object({
  planId: z.string().min(1, "Plan selection is required"),
  couponCode: z.string().max(50).optional().or(z.literal("")),
  paymentType: z.string().refine(v => ["FULL", "PARTIAL"].includes(v), "Invalid payment type"),
  amountToPay: z.number().min(0).optional(),
});

export const partialPaymentSchema = z.object({
  subscriptionId: z.string().min(1, "Subscription ID is required"),
  amountPaid: z.number().min(1).max(1000000),
  invoiceNumber: z.string().min(1, "Invoice number is required"),
});

export type SubscriptionFormData = z.infer<typeof subscriptionSchema>;
export type PartialPaymentData = z.infer<typeof partialPaymentSchema>;

