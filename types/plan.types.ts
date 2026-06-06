export interface PlanTypes {
  _id: string;
  name: string;
  description: string;
  durationMonths: number;
  baseMonthlyPrice: number;
  discountPercentage: number;
  allowPartialPayment: boolean;
  isActive: boolean;
}
