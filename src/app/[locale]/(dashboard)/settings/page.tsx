/**
 * @file app/(dashboard)/settings/page.tsx
 * @description Settings page with real user data.
 * Supports profile update and account deletion.
 */

import { Metadata } from "next";
import SettingsView from "@/components/dashboard/settings-view";
import { getSettingsPageData } from "@/modules/settings/server/get-settings-page-data";

export const metadata: Metadata = { title: "settings" };

export default async function SettingsPage(): Promise<React.JSX.Element> {
  const data = await getSettingsPageData();

  return <SettingsView data={data} />;
}
