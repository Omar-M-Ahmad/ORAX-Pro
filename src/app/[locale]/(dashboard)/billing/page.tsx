/**
 * @file src/app/(dashboard)/billing/page.tsx
 * @description Billing page with dynamic subscription details.
 */

import { Metadata } from "next";
import BillingView from "@/components/dashboard/billing-view";
import { getBillingPageData } from "@/modules/billing/server/get-billing-page-data";

export const metadata: Metadata = { title: "Billing" };

export default async function BillingPage(): Promise<React.JSX.Element> {
  const data = await getBillingPageData();

  return <BillingView data={data} />;
}
