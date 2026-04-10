/**
 * @file src/app/api/billing/route.ts
 * @description API route to fetch billing info for the authenticated user.
 * Current phase: stable demo billing response.
 */

import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { siteConfig } from "@/config/site";

export async function GET(): Promise<Response> {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({
      subscription: {
        id: `demo-${session.user.id}`,
        plan: "pro",
        status: "active",
        price: siteConfig.pricing.pro,
        currentPeriodEnd: null,
      },
    });
  } catch (error) {
    console.error("[api/billing][GET]", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
