/**
 * @file app/(auth)/login/page.tsx
 * @description ORAX Login page.
 * - All text from @/lib/i18n
 * - Connected to Auth.js v5 via signIn
 * - OAuth icons inline SVG
 */

import { Zap } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import LoginForm from "@/app/[locale]/(auth)/login/_form";

export const metadata: Metadata = { title: "Login" };

export default function LoginPage(): React.JSX.Element {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg-0)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "-20%",
          left: "50%",
          transform: "translateX(-50%)",
          width: 600,
          height: 500,
          background:
            "radial-gradient(ellipse,rgba(99,102,241,0.1) 0%,transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          backgroundImage:
            "linear-gradient(rgba(99,102,241,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(99,102,241,0.03) 1px,transparent 1px)",
          backgroundSize: "72px 72px",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          maxWidth: 440,
        }}
      >
        <Link
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 40,
            textDecoration: "none",
          }}
        >
          <span
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 32,
              height: 32,
              borderRadius: 9,
              background: "var(--brand)",
              boxShadow: "0 0 20px rgba(99,102,241,0.5)",
            }}
          >
            <Zap size={15} fill="white" color="white" />
          </span>
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 20,
              fontWeight: 800,
              color: "var(--text-1)",
              letterSpacing: "-0.04em",
            }}
          >
            ORAX
          </span>
        </Link>

        <LoginForm />
      </div>
    </div>
  );
}
