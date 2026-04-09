/**
 * @file app/(dashboard)/dashboard/page.tsx
 * @description ORAX Dashboard overview with real data.
 */

import DashboardView from "@/features/dashboard/components/dashboard-view";
import { Metadata } from "next";

export const metadata: Metadata = { title: "Dashboard" };

export default function DashboardPage(): React.JSX.Element {
  return <DashboardView />;
}
