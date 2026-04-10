/**
 * @file app/(dashboard)/settings/page.tsx
 * @description Settings page with real user data.
 * Supports profile update and account deletion.
 */

import SettingsView from "@/components/dashboard/settings-view";
import { Metadata } from "next";

export const metadata: Metadata = { title: "settings" };

export default function SettingsPage(): React.JSX.Element {
  return <SettingsView />;
}
