import { z } from "zod";

export const couponSchema = z.object({
  code: z
    .string()
    .min(2, "Coupon code must be at least 2 characters")
    .max(50, "Coupon code must be less than 50 characters")
    .toUpperCase(),
  type: z.string().refine(v => ["PERCENTAGE", "FLAT"].includes(v), "Invalid coupon type"),
  value: z
    .number()
    .min(1, "Discount value must be at least 1")
    .max(1000000, "Discount value seems too high"),
  expiryDate: z
    .string()
    .or(z.date())
    .refine(
      (date) => {
        const expiryDate = typeof date === "string" ? new Date(date) : date;
        return expiryDate > new Date();
      },
      { message: "Expiry date must be in the future" }
    ),
  isActive: z
    .boolean()
    .optional()
    .default(true),
});

export type CouponFormData = z.infer<typeof couponSchema>;

