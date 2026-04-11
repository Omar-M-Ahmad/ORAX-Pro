/**
 * @file src/modules/dashboard/server/dashboard.ts
 * @description Data helpers for dashboard statistics.
 */

import { db } from "@/lib/db";
import { subscriptions, users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

/** Type for the dashboard statistics response */
type DashboardStats = {
  user: {
    id: string;
    name: string | null;
    email: string | null;
  } | null;
  subscription: {
    id: string;
    plan: string;
    status: string;
    currentPeriodEnd: Date | null;
  }[];
  stats: {
    activeSubscriptions: number;
    showcaseProjects: number;
    showcaseUsage: number;
  };
};

/** Retrieve current user subscriptions and compute personal stats */
export async function getDashboardStats(
  userId: string,
): Promise<DashboardStats> {
  const [user] = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
    })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  const subscription = await db
    .select({
      id: subscriptions.id,
      plan: subscriptions.plan,
      status: subscriptions.status,
      currentPeriodEnd: subscriptions.currentPeriodEnd,
    })
    .from(subscriptions)
    .where(eq(subscriptions.userId, userId));

  const stats = {
    activeSubscriptions: subscription.filter((sub) => sub.status === "active")
      .length,
    showcaseProjects: 3,
    showcaseUsage: 12,
  };

  return {
    user,
    subscription,
    stats,
  };
}
