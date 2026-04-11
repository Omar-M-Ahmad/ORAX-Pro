/**
 * @file src/app/(dashboard)/billing/page.tsx
 * @description Billing page with dynamic subscription details.
 */

import type { Metadata } from "next";
import BillingView from "@/components/dashboard/billing-view";
import { getBillingPageData } from "@/modules/billing/server/get-billing-page-data";

export const metadata: Metadata = {
  title: "Billing | ORAX Pro",
  description: "Manage your ORAX Pro subscription, plan, and invoice history.",
};

export default async function BillingPage(): Promise<React.JSX.Element> {
  const data = await getBillingPageData();

  return <BillingView data={data} />;
}
