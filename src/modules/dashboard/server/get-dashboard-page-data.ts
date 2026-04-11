/**
 * @file src/modules/dashboard/server/get-dashboard-page-data.ts
 * @description Server data loader for dashboard page.
 */

import { auth } from "@/lib/auth/config";
import { getDashboardStats } from "@/modules/dashboard/server/get-dashboard-stats";

export type DashboardPageData = {
  userName: string;
  stats: {
    revenue: number;
    users: number;
    subscriptions: number;
  };
  recent: {
    customer: string;
    plan: string;
    status: string;
    price: number;
    createdAt: Date | null;
  }[];
};

export async function getDashboardPageData(): Promise<DashboardPageData> {
  const session = await auth();
  const userId = session?.user?.id;
  const stats = userId
    ? await getDashboardStats(userId)
    : { userCount: 0, subscriptionsCount: 0, revenue: 0, recent: [] };

  return {
    userName: session?.user?.name?.trim() || "Account",
    stats: {
      revenue: stats.revenue,
      users: stats.userCount,
      subscriptions: stats.subscriptionsCount,
    },
    recent: stats.recent,
  };
}
