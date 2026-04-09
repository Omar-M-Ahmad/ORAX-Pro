/**
 * @file src/app/(auth)/forgot-password/page.tsx
 * @description Forgot password page for requesting a reset link.
 */

import { Metadata } from "next";
import ForgotPasswordForm from "@/features/auth/components/forgot-password-form";

export const metadata: Metadata = { title: "Forgot Password" };

export default function ForgotPasswordPage(): React.JSX.Element {
  return <ForgotPasswordForm />;
}
