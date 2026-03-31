/**
 * @file src/app/api/auth/reset-password/route.ts
 * @description Reset password using a valid password reset token.
 */

import { NextResponse } from "next/server";
import { and, eq, gt } from "drizzle-orm";

import { db } from "@/lib/db";
import { users, passwordResets } from "@/lib/db/schema";
import { hashPassword } from "@/lib/auth-utils";

export async function POST(request: Request): Promise<Response> {
  try {
    const body = (await request.json()) as {
      token?: string;
      password?: string;
    };

    const token = String(body.token ?? "").trim();
    const password = String(body.password ?? "");

    if (!token || !password) {
      return NextResponse.json(
        { error: "Token and password are required" },
        { status: 400 },
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 },
      );
    }

    const reset = await db.query.passwordResets.findFirst({
      where: and(
        eq(passwordResets.token, token),
        gt(passwordResets.expires, new Date()),
      ),
    });

    if (!reset) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 400 },
      );
    }

    const hashedPassword = await hashPassword(password);

    await db
      .update(users)
      .set({
        hashedPassword,
        updatedAt: new Date(),
      })
      .where(eq(users.id, reset.userId));

    await db.delete(passwordResets).where(eq(passwordResets.token, token));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[api/auth/reset-password][POST]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
