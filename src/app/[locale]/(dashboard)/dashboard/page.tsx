/**
 * @file app/(dashboard)/dashboard/page.tsx
 * @description ORAX Dashboard overview with real data.
 */

import type { Metadata } from "next";
import DashboardView from "@/components/dashboard/dashboard-view";
import { getDashboardPageData } from "@/modules/dashboard/server/get-dashboard-page-data";

export const metadata: Metadata = {
  title: "Dashboard | ORAX Pro",
  description: "User dashboard for ORAX Pro account analytics and activity.",
};

export default async function DashboardPage(): Promise<React.JSX.Element> {
  const data = await getDashboardPageData();

  return <DashboardView data={data} />;
}
