import { z } from "zod";

export const planSchema = z.object({
  name: z
    .string()
    .min(1, "Plan name is required")
    .max(100, "Plan name must be less than 100 characters"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(500, "Description must be less than 500 characters"),
  durationMonths: z
    .number()
    .int("Duration must be a whole number")
    .min(1, "Duration must be at least 1 month")
    .max(120, "Duration must be less than 120 months"),
  baseMonthlyPrice: z
    .number()
    .min(0, "Price cannot be negative")
    .max(1000000, "Price seems too high"),
  discountPercentage: z
    .number()
    .min(0, "Discount cannot be negative")
    .max(100, "Discount cannot exceed 100%")
    .optional()
    .default(0),
  allowPartialPayment: z
    .boolean()
    .optional()
    .default(false),
  isActive: z
    .boolean()
    .optional()
    .default(true),
});

export type PlanFormData = z.infer<typeof planSchema>;

