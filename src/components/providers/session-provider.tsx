/**
 * @file components/providers/session-provider.tsx
 * @description Session provider wrapper for Auth.js v5.
 * Provides session data to client components via useSession hook.
 */

"use client";

import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";

export function SessionProvider({ children }: { children: React.ReactNode }) {
  return <NextAuthSessionProvider>{children}</NextAuthSessionProvider>;
}
