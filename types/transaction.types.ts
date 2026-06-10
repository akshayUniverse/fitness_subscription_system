export interface TransactionTypes {
  _id: string;

  invoiceNumber: string;

  totalAmount: number;

  amountPaid: number;

  remainingBalance: number;

  paymentStatus: string;

  paymentDate: string;

   subscriptionId?: {
    _id: string;

    planSnapshot?: {
      name?: string;
    };
  };
}