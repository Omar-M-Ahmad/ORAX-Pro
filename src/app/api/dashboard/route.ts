/**
 * @file src/app/api/dashboard/route.ts
 * @description API route to provide dashboard statistics.
 */

import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { getDashboardStats } from "@/modules/dashboard/server/get-dashboard-stats";

/** GET /api/dashboard — returns dashboard stats */
export async function GET(): Promise<Response> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const stats = await getDashboardStats(session.user.id);
    return NextResponse.json(stats);
  } catch (error) {
    console.error("[api/dashboard][GET]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
