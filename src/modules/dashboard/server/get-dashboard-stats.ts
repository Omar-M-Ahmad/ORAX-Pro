/**
 * @file src/modules/dashboard/server/dashboard.ts
 * @description Data helpers for dashboard statistics.
 */

import { db } from "@/lib/db";
import { subscriptions } from "@/lib/db/schema";
import { siteConfig } from "@/config/site";
import { desc, eq } from "drizzle-orm";

/** Type for the dashboard statistics response */
export interface DashboardStats {
  userCount: number;
  subscriptionsCount: number;
  revenue: number;
  recent: {
    customer: string;
    plan: string;
    status: string;
    price: number;
    createdAt: Date | null;
  }[];
}

/** Retrieve current user subscriptions and compute personal stats */
export async function getDashboardStats(userId: string): Promise<DashboardStats> {
  const subscriptionList = await db.query.subscriptions.findMany({
    where: eq(subscriptions.userId, userId),
    orderBy: [desc(subscriptions.createdAt)],
  });

  const userCount = 1;
  const subscriptionsCount = subscriptionList.length;

  const revenue = subscriptionList.reduce((total, sub) => {
    const planPrice =
      siteConfig.pricing[sub.plan as keyof typeof siteConfig.pricing] ?? 0;
    return total + planPrice;
  }, 0);
  const recent = subscriptionList.slice(0, 5).map((sub) => {
    const price =
      siteConfig.pricing[sub.plan as keyof typeof siteConfig.pricing] ?? 0;
    return {
      customer: "You",
      plan: sub.plan,
      status: sub.status,
      price,
      createdAt: sub.createdAt ?? null,
    };
  });

  return { userCount, subscriptionsCount, revenue, recent };
}
