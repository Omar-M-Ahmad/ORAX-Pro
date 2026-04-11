/**
 * @file src/app/(auth)/reset-password/page.tsx
 * @description Reset password page using token from query string.
 */

import type { Metadata } from "next";
import ResetPasswordForm from "@/app/[locale]/(auth)/reset-password/_form";

export const metadata: Metadata = { title: "Reset Password" };

export default function ResetPasswordPage(): React.JSX.Element {
  return <ResetPasswordForm />;
}
