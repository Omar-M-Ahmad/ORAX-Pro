/**
 * @file src/app/api/user/route.ts
 * @description User profile API.
 * GET returns the current authenticated user.
 * PATCH updates editable profile fields.
 */

import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { auth } from "@/lib/auth/config";
import { db } from "@/lib/db";
import { users, accounts, sessions, subscriptions } from "@/lib/db/schema";

/**
 * GET /api/user
 * Returns the current authenticated user profile.
 */
export async function GET(): Promise<Response> {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await db.query.users.findFirst({
      where: eq(users.id, session.user.id),
      columns: {
        id: true,
        name: true,
        email: true,
        image: true,
        bio: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("[api/user][GET]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

/**
 * PATCH /api/user
 * Updates editable user profile fields.
 */
export async function PATCH(request: Request): Promise<Response> {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse request body
    const body = (await request.json()) as {
      name?: string;
      image?: string;
      bio?: string;
    };

    const updates: {
      name?: string | null;
      image?: string | null;
      bio?: string | null;
      updatedAt: Date;
    } = {
      updatedAt: new Date(),
    };

    if (body.name !== undefined) updates.name = body.name.trim() || null;

    if (body.image !== undefined) updates.image = body.image.trim() || null;

    if (body.bio !== undefined) updates.bio = body.bio.trim() || null;

    // Update user
    const [updatedUser] = await db
      .update(users)
      .set(updates)
      .where(eq(users.id, session.user.id))
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
        image: users.image,
        bio: users.bio,
      });

    return NextResponse.json({ user: updatedUser });
  } catch (error) {
    console.error("[api/user][PATCH]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

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
