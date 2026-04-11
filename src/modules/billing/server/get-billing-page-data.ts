/**
 * @file src/modules/billing/server/get-billing-page-data.ts
 * @description Server data loader for billing page.
 */

import { auth } from "@/lib/auth/config";
import { db } from "@/lib/db";
import { subscriptions } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { siteConfig } from "@/config/site";

export type BillingPageData = {
  currentPlan: string;
  status: string;
  price: number;
  invoices: {
    id: string;
    date: Date | null;
    amount: number;
    status: string;
  }[];
};

export async function getBillingPageData(): Promise<BillingPageData> {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      currentPlan: "Free",
      status: "inactive",
      price: siteConfig.pricing.free,
      invoices: [],
    };
  }

  const userSubscriptions = await db.query.subscriptions.findMany({
    where: eq(subscriptions.userId, session.user.id),
    orderBy: [desc(subscriptions.createdAt)],
  });

  const current = userSubscriptions[0];

  return {
    currentPlan: current?.plan ?? "free",
    status: current?.status ?? "inactive",
    price:
      siteConfig.pricing[
        (current?.plan ?? "free") as keyof typeof siteConfig.pricing
      ] ?? 0,
    invoices: userSubscriptions.map((item) => ({
      id: item.id,
      date: item.createdAt ?? null,
      amount:
        siteConfig.pricing[item.plan as keyof typeof siteConfig.pricing] ?? 0,
      status: item.status,
    })),
  };
}
