/**
 * @file app/(auth)/register/page.tsx
 * @description ORAX Register page.
 * - All text from @/lib/i18n (including headline — no hardcoded strings)
 * - Connected to Auth API via /api/auth/register
 * - OAuth via next-auth signIn
 */

import { Metadata } from "next";
import RegisterForm from "@/features/auth/components/register-form";

export const metadata: Metadata = { title: "Register" };

export default function RegisterPage(): React.JSX.Element {
  return <RegisterForm />;
}
