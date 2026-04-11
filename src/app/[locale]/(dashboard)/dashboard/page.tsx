/**
 * @file app/(dashboard)/dashboard/page.tsx
 * @description ORAX Dashboard overview with real data.
 */

import type { Metadata } from "next";
import DashboardView from "@/components/dashboard/dashboard-view";
import { auth } from "@/lib/auth/config";
import { getDashboardPageData } from "@/modules/dashboard/server/get-dashboard-page-data";

export const metadata: Metadata = {
  title: "Dashboard | ORAX Pro",
  description: "User dashboard for ORAX Pro account analytics and activity.",
};

export default async function DashboardPage(): Promise<React.JSX.Element> {
  const session = await auth();

  const data = await getDashboardPageData(
    session?.user?.id,
    session?.user?.name ?? undefined,
  );

  return <DashboardView data={data} />;
}
