/**
 * @file src/modules/dashboard/server/dashboard.ts
 * @description Data helpers for dashboard statistics.
 */

import { db } from "@/lib/db";
import { users, subscriptions } from "@/lib/db/schema";
import { siteConfig } from "@/config/site";

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

/** Retrieve users/subscriptions and compute counts and revenue */
export async function getDashboardStats(): Promise<DashboardStats> {
  // Fetch all users and subscriptions in parallel
  const [userList, subscriptionList] = await Promise.all([
    db.select().from(users),
    db.select().from(subscriptions),
  ]);

  const userCount = userList.length;
  const subscriptionsCount = subscriptionList.length;

  // Sum revenue based on plan price (ignoring refunds/cancellations)
  const revenue = subscriptionList.reduce((total, sub) => {
    const planPrice =
      siteConfig.pricing[sub.plan as keyof typeof siteConfig.pricing] ?? 0;
    return total + planPrice;
  }, 0);

  // Build lookup map of users by ID
  const userMap = new Map(userList.map((u) => [u.id, u]));

  // Sort subscriptions by creation date descending and take latest 5
  const sortedSubs = subscriptionList
    .slice()
    .sort((a, b) => {
      const aDate = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const bDate = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return bDate - aDate;
    })
    .slice(0, 5);

  const recent = sortedSubs.map((sub) => {
    const user = userMap.get(sub.userId);
    const price =
      siteConfig.pricing[sub.plan as keyof typeof siteConfig.pricing] ?? 0;
    return {
      customer: user?.name ?? "Unknown",
      plan: sub.plan,
      status: sub.status,
      price,
      createdAt: sub.createdAt ?? null,
    };
  });

  return { userCount, subscriptionsCount, revenue, recent };
}
