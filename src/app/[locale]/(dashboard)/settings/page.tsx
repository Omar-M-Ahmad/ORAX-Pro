/**
 * @file app/(dashboard)/settings/page.tsx
 * @description Settings page with real user data.
 * Supports profile update and account deletion.
 */

import type { Metadata } from "next";
import SettingsView from "@/components/dashboard/settings-view";
import { getSettingsPageData } from "@/modules/settings/server/get-settings-page-data";

export const metadata: Metadata = {
  title: "Settings | ORAX Pro",
  description:
    "Update profile, language, theme, and security settings in ORAX Pro.",
};

export default async function SettingsPage(): Promise<React.JSX.Element> {
  const data = await getSettingsPageData();

  return <SettingsView data={data} />;
}
