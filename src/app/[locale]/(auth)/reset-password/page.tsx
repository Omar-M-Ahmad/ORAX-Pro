/**
 * @file src/app/(auth)/reset-password/page.tsx
 * @description Reset password page using token from query string.
 */

import { Metadata } from "next";
import ResetPasswordForm from "@/features/auth/components/reset-password-form";

export const metadata: Metadata = { title: "Reset Password" };

export default function ResetPasswordPage(): React.JSX.Element {
  return <ResetPasswordForm />;
}
