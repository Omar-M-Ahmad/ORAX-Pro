/**
 * @file src/app/api/auth/forgot-password/route.ts
 * @description Request a password reset token and send reset email.
 */

import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { users, passwordResets } from "@/lib/db/schema";
import { generateToken } from "@/lib/tokens";
import { sendPasswordResetEmail } from "@/lib/email";

export async function POST(request: Request): Promise<Response> {
  try {
    const body = (await request.json()) as { email?: string };
    const email = String(body.email ?? "")
      .trim()
      .toLowerCase();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
      columns: {
        id: true,
        email: true,
      },
    });

    // We don't reveal whether the email exists or not
    if (!user) {
      return NextResponse.json({ success: true });
    }

    const token = generateToken();
    const expires = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

    await db.insert(passwordResets).values({
      token,
      userId: user.id,
      expires,
    });

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const resetUrl = `${baseUrl}/reset-password?token=${token}`;

    await sendPasswordResetEmail({
      to: user.email,
      resetUrl,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[api/auth/forgot-password][POST]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
