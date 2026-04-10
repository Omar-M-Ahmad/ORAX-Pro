/**
 * @file src/api/user/delete/route.ts
 * @description Delete user account and all associated data.
 */

import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { db } from "@/lib/db";
import { users, accounts, sessions, subscriptions } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

/**
 * DELETE /api/user/delete - Delete user account permanently
 */
export async function DELETE() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Delete in order (respecting foreign key constraints)
    // Note: With ON DELETE CASCADE in schema, this should be automatic
    // but we do it explicitly for safety

    // Delete subscriptions
    await db.delete(subscriptions).where(eq(subscriptions.userId, userId));

    // Delete sessions
    await db.delete(sessions).where(eq(sessions.userId, userId));

    // Delete accounts (OAuth providers)
    await db.delete(accounts).where(eq(accounts.userId, userId));

    // Delete user
    await db.delete(users).where(eq(users.id, userId));

    return NextResponse.json({ success: true, message: "Account deleted" });
  } catch (error) {
    console.error("[api/user/delete][DELETE] ", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
