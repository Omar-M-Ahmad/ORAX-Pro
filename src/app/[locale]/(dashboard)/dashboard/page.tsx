/**
 * @file app/(dashboard)/dashboard/page.tsx
 * @description ORAX Dashboard overview with real data.
 */

import { Metadata } from "next";
import DashboardView from "@/components/dashboard/dashboard-view";
import { getDashboardPageData } from "@/modules/dashboard/server/get-dashboard-page-data";

export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardPage(): Promise<React.JSX.Element> {
  const data = await getDashboardPageData();

  return <DashboardView data={data} />;
}
