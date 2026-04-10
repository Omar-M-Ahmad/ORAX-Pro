/**
 * @file src/modules/billing/server/get-billing-page-data.ts
 * @description Server data loader for billing page.
 */

import { auth } from "@/lib/auth/config";
import { db } from "@/lib/db";
import { subscriptions } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";

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
      currentPlan: "Pro",
      status: "active",
      price: 99,
      invoices: [],
    };
  }

  const userSubscriptions = await db.query.subscriptions.findMany({
    where: eq(subscriptions.userId, session.user.id),
    orderBy: [desc(subscriptions.createdAt)],
  });

  const current = userSubscriptions[0];

  return {
    currentPlan: current?.plan ?? "Pro",
    status: current?.status ?? "active",
    price: current?.plan === "starter" ? 49 : 99,
    invoices: userSubscriptions.map((item) => ({
      id: item.id,
      date: item.createdAt ?? null,
      amount: item.plan === "starter" ? 49 : 99,
      status: item.status,
    })),
  };
}
