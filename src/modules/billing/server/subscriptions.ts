/**
 * @file src/modulers/billing/server/subscriptions.ts
 * @description Helpers to fetch subscription data from the database.
 */

import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { subscriptions } from "@/lib/db/schema";

/**
 * Fetch the first subscription of a given user.
 * You can extend this helper to return multiple subscriptions if needed.
 *
 * @param userId - The ID of the user.
 * @returns The subscription record or null if none exists.
 */
export async function getUserSubscription(userId: string) {
  return db.query.subscriptions.findFirst({
    where: eq(subscriptions.userId, userId),
  });
}
