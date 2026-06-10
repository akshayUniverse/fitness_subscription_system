import Subscription, { SubscriptionStatus } from "@/models/Subscription";
import Transaction, { PaymentStatus } from "@/models/Transaction";
import User from "@/models/User";

export const analyticsService = {
  async getRevenueAnalytics() {
    const revenue = await Transaction.aggregate([
      {
        $group: {
          _id: {
            year: {
              $year: "$paymentDate",
            },
            month: {
              $month: "$paymentDate",
            },
          },
          revenue: {
            $sum: "$amountPaid",
          },
          transactions: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1,
        },
      },
    ]);

    return revenue;
  },
  async getRecentTransactions() {
    return Transaction.find()
      .sort({
        createdAt: -1,
      })
      .limit(10);
  },
  async getRecentSubscriptions() {
    return Subscription.find()
      .populate("userId")
      .populate("planId")
      .sort({
        createdAt: -1,
      })
      .limit(10);
  },
  async getTransactionSummary() {
    const totalTransactions = await Transaction.countDocuments();

    const completedPayments = await Transaction.countDocuments({
      paymentStatus: PaymentStatus.COMPLETED,
    });

    const partialPayments = await Transaction.countDocuments({
      paymentStatus: PaymentStatus.PARTIAL,
    });

    const revenue = await Transaction.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: {
            $sum: "$amountPaid",
          },
        },
      },
    ]);

    return {
      totalTransactions,
      completedPayments,
      partialPayments,
      revenue: revenue[0]?.totalRevenue || 0,
    };
  },
  async getPlanAnalytics() {
    return Subscription.aggregate([
      {
        $group: {
          _id: "$planId",
          subscriptions: {
            $sum: 1,
          },
        },
      },
      {
        $lookup: {
          from: "subscriptionplans",
          localField: "_id",
          foreignField: "_id",
          as: "plan",
        },
      },
      {
        $unwind: "$plan",
      },
      {
        $project: {
          _id: 0,
          planName: "$plan.name",
          subscriptions: 1,
        },
      },
    ]);
  },
  async getSubscriptionSummary() {
    const total = await Subscription.countDocuments();
    const active = await Subscription.countDocuments({ status: SubscriptionStatus.ACTIVE });
    const pending = await Subscription.countDocuments({ status: SubscriptionStatus.PENDING });
    const expired = await Subscription.countDocuments({ status: SubscriptionStatus.EXPIRED });
    const completed = await Subscription.countDocuments({ status: SubscriptionStatus.COMPLETED });

    return {
      total,
      active,
      pending,
      expired,
      completed,
    };
  },
  async getUserSummary() {
    return User.countDocuments();
  },
  async getRevenueSummary() {
    const subscriptions = await Subscription.find();
    
    let totalRevenue = 0;
    let pendingRevenue = 0;

    subscriptions.forEach((sub) => {
      totalRevenue += sub.paidAmount;
      pendingRevenue += sub.balanceDue;
    });

    return {
      totalRevenue,
      pendingRevenue,
    };
  },
  async getDashboardMetrics() {
    const [subscriptionSummary, userCount, revenueSummary] = await Promise.all([
      this.getSubscriptionSummary(),
      this.getUserSummary(),
      this.getRevenueSummary(),
    ]);

    return {
      users: userCount,
      subscriptions: subscriptionSummary.total,
      activeSubscriptions: subscriptionSummary.active,
      pendingSubscriptions: subscriptionSummary.pending,
      expiredSubscriptions: subscriptionSummary.expired,
      completedSubscriptions: subscriptionSummary.completed,
      totalRevenue: revenueSummary.totalRevenue,
      pendingRevenue: revenueSummary.pendingRevenue,
    };
  },
  async getTransactionsByFilters(
    userId?: string,
    planId?: string,
    status?: string,
    dateFrom?: Date,
    dateTo?: Date
  ) {
    const filter: any = {};

    if (userId) {
      filter.userId = userId;
    }

    if (status) {
      filter.paymentStatus = status;
    }

    if (dateFrom || dateTo) {
      filter.paymentDate = {};
      if (dateFrom) {
        filter.paymentDate.$gte = dateFrom;
      }
      if (dateTo) {
        filter.paymentDate.$lte = dateTo;
      }
    }

    let query = Transaction.find(filter)
      .populate("userId")
      .populate("subscriptionId")
      .sort({ paymentDate: -1 });

    if (planId) {
      query = query.populate({
        path: "subscriptionId",
        match: { planId },
      });
    }

    return query.exec();
  },
  async getSubscriptionsByFilters(
    status?: string,
    userId?: string,
    planId?: string
  ) {
    const filter: any = {};

    if (status) {
      filter.status = status;
    }

    if (userId) {
      filter.userId = userId;
    }

    if (planId) {
      filter.planId = planId;
    }

    return Subscription.find(filter)
      .populate("userId")
      .populate("planId")
      .populate("couponId")
      .sort({ createdAt: -1 });
  },
};
