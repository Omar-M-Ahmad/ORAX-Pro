/**
 * @file app/(dashboard)/layout.tsx
 * @description Server dashboard layout that reads auth session.
 */

import { auth } from "@/lib/auth/config";
import DashboardShell from "@/components/dashboard/dashboard-shell";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}): Promise<React.JSX.Element> {
  const session = await auth();

  return (
    <DashboardShell
      userName={session?.user?.name?.trim() || "User"}
      userEmail={session?.user?.email?.trim() || ""}
    >
      {children}
    </DashboardShell>
  );
}
