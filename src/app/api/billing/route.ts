/**
 * @file src/app/api/billing/route.ts
 * @description API route to fetch billing info for the authenticated user.
 */

import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { getUserSubscription } from "@/modules/billing/server/subscriptions";
import { siteConfig } from "@/config/site";

export async function GET(): Promise<Response> {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const subscription = await getUserSubscription(session.user.id);
    const plan = subscription?.plan ?? "free";
    const price =
      siteConfig.pricing[plan as keyof typeof siteConfig.pricing] ?? 0;

    return NextResponse.json({
      subscription: {
        id: subscription?.id ?? null,
        plan,
        status: subscription?.status ?? "inactive",
        price,
        currentPeriodEnd: subscription?.createdAt ?? null,
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
