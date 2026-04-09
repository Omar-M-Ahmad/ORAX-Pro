/**
 * @file src/app/(dashboard)/billing/page.tsx
 * @description Billing page with dynamic subscription details.
 */

import BillingView from "@/features/dashboard/components/billing-view";
import { Metadata } from "next";

export const metadata: Metadata = { title: "Billing" };

export default function BillingPage(): React.JSX.Element {
  return <BillingView />;
}
