/**
 * @file src/components/providers/session-provider.tsx
 * @description ORAX session provider.
 */

"use client";

import { SessionProvider } from "next-auth/react";

export default function AuthSessionProvider({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  return <SessionProvider>{children}</SessionProvider>;
}
