/**
 * @file src/app/api/settings/profile/route.ts
 * @description Update current user profile.
 */

import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { auth } from "@/lib/auth/config";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";

export async function PATCH(request: Request): Promise<Response> {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as {
      name?: string;
      bio?: string;
    };

    const name = String(body.name ?? "").trim();
    const bio = String(body.bio ?? "").trim();

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    await db
      .update(users)
      .set({
        name,
        bio,
        updatedAt: new Date(),
      })
      .where(eq(users.id, session.user.id));

    return NextResponse.json({
      success: true,
      user: {
        name,
        bio,
      },
    });
  } catch (error) {
    console.error("[api/settings/profile][PATCH]", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
