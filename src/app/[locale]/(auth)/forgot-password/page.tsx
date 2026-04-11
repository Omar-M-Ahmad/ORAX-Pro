/**
 * @file src/app/(auth)/forgot-password/page.tsx
 * @description Forgot password page for requesting a reset link.
 */

import type { Metadata } from "next";
import ForgotPasswordForm from "@/app/[locale]/(auth)/forgot-password/_form";

export const metadata: Metadata = { title: "Forgot Password" };

export default function ForgotPasswordPage(): React.JSX.Element {
  return <ForgotPasswordForm />;
}
