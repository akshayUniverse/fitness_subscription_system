export interface PlanSnapshot {
  name: string;
  description: string;
  durationMonths: number;
  baseMonthlyPrice: number;
  discountPercentage: number;
}

export interface SubscriptionTypes {
  _id: string;

  totalAmount: number;
  paidAmount: number;
  balanceDue: number;

  paymentType: string;
  status: string;

  startDate: string;
  endDate: string;

  planSnapshot: PlanSnapshot;
}