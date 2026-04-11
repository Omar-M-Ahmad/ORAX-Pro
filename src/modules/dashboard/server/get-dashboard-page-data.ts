/**
 * @file src/modules/dashboard/server/get-dashboard-page-data.ts
 * @description Server data loader for dashboard page.
 */

import { getDashboardStats } from "@/modules/dashboard/server/get-dashboard-stats";

export type DashboardPageData = {
  userName: string;
  stats: {
    activeSubscriptions: number;
    showcaseProjects: number;
    showcaseUsage: number;
  };
  subscription: {
    id: string;
    plan: string;
    status: string;
    currentPeriodEnd: Date | null;
  }[];
};

export async function getDashboardPageData(
  userId: string | undefined,
  userName: string | undefined,
): Promise<DashboardPageData> {
  if (!userId) {
    return {
      userName: userName?.trim() || "User",
      stats: {
        activeSubscriptions: 0,
        showcaseProjects: 0,
        showcaseUsage: 0,
      },
      subscription: [],
    };
  }

  const dashboard = await getDashboardStats(userId);

  return {
    userName: dashboard.user?.name?.trim() || userName?.trim() || "User",
    stats: {
      activeSubscriptions: dashboard.stats.activeSubscriptions,
      showcaseProjects: dashboard.stats.showcaseProjects,
      showcaseUsage: dashboard.stats.showcaseUsage,
    },
    subscription: dashboard.subscription,
  };
}
