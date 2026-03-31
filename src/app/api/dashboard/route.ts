/**
 * @file src/app/api/dashboard/route.ts
 * @description API route to provide dashboard statistics.
 */

import { NextResponse } from "next/server";
import { getDashboardStats } from "@/lib/dashboard";

/** GET /api/dashboard — returns dashboard stats */
export async function GET(): Promise<Response> {
  try {
    const stats = await getDashboardStats();
    return NextResponse.json(stats);
  } catch (error) {
    console.error("[api/dashboard][GET]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
