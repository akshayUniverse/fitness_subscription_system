import User, { UserRole } from "@/models/User";

export const userService = {
  async getUserByClerkId(clerkId: string) {
    const user = await User.findOne({ clerkId });
    return user;
  },

  async getUserById(userId: string) {
    const user = await User.findById(userId);
    return user;
  },

  async updateUserRole(userId: string, role: UserRole) {
    const user = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true }
    );
    return user;
  },

  async updateUserProfile(
    userId: string,
    data: {
      firstName?: string;
      lastName?: string;
      fullName?: string;
    }
  ) {
    const user = await User.findByIdAndUpdate(
      userId,
      data,
      { new: true }
    );
    return user;
  },

  async setActiveSubscription(userId: string, subscriptionId: string | null) {
    const user = await User.findByIdAndUpdate(
      userId,
      { activeSubscriptionId: subscriptionId },
      { new: true }
    );
    return user;
  },

  async getDisplayName(user: any): Promise<string> {
    // Try fullName first, then firstName + lastName, then name, finally email
    if (user?.fullName) return user.fullName;
    if (user?.firstName || user?.lastName) {
      return `${user.firstName || ""} ${user.lastName || ""}`.trim();
    }
    if (user?.name && user.name !== "Unknown User") return user.name;
    return user?.email || "Unknown User";
  },
};

