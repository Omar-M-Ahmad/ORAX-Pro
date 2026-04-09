/**
 * @file src/features/auth/components/login-form.tsx
 * @description Login form for ORAX.
 */

"use client";

import { useLocale } from "@/components/providers/locale-provider";
import { t } from "@/i18n";
import { useState } from "react";
import Input from "@/components/ui/input";
import Link from "next/link";
import { ArrowRight, Eye, EyeOff } from "lucide-react";
import { SocialIcons } from "@/components/shared/icons";

export default function LoginForm() {
  const { locale: l } = useLocale();
  const [showPass, setShowPass] = useState(false);

  return (
    <div
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: 24,
        padding: 40,
        boxShadow: "0 24px 60px rgba(0,0,0,0.25)",
      }}
    >
      <h1
        style={{
          fontFamily: "var(--font-display)",
          fontSize: 28,
          fontWeight: 800,
          letterSpacing: "-0.03em",
          color: "var(--text-1)",
          marginBottom: 8,
        }}
      >
        {t("auth.login.title", l)}
      </h1>

      <p style={{ color: "var(--text-3)", fontSize: 14, marginBottom: 32 }}>
        {t("auth.login.subtitle", l)}
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 10,
          marginBottom: 28,
        }}
      >
        <Link
          href="/dashboard"
          className="btn btn-ghost"
          style={{
            padding: "10px 16px",
            fontSize: 13,
            gap: 8,
            justifyContent: "center",
          }}
        >
          <SocialIcons.GitHub />
          GitHub
        </Link>

        <Link
          href="/dashboard"
          className="btn btn-ghost"
          style={{
            padding: "10px 16px",
            fontSize: 13,
            gap: 8,
            justifyContent: "center",
          }}
        >
          <SocialIcons.Google />
          Google
        </Link>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 28,
        }}
      >
        <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
        <span
          style={{
            fontSize: 12,
            color: "var(--text-3)",
            fontFamily: "var(--font-mono)",
            letterSpacing: "0.08em",
          }}
        >
          {t("auth.login.or", l)}
        </span>
        <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
      </div>

      <form style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div>
          <label
            htmlFor="login-email"
            style={{
              display: "block",
              fontSize: 13,
              fontWeight: 500,
              color: "var(--text-2)",
              marginBottom: 8,
            }}
          >
            {t("auth.login.email", l)}
          </label>
          <Input
            id="login-email"
            name="email"
            type="email"
            placeholder="you@example.com"
            required
          />
        </div>

        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 8,
            }}
          >
            <label
              htmlFor="login-password"
              style={{
                fontSize: 13,
                fontWeight: 500,
                color: "var(--text-2)",
              }}
            >
              {t("auth.login.password", l)}
            </label>

            <Link
              href="/forgot-password"
              style={{
                fontSize: 12,
                color: "var(--brand)",
                textDecoration: "none",
              }}
            >
              {t("auth.login.forgot", l)}
            </Link>
          </div>

          <div style={{ position: "relative" }}>
            <Input
              id="login-password"
              name="password"
              type={showPass ? "text" : "password"}
              placeholder={showPass ? "••••••••" : "password"}
              required
              minLength={8}
            />
            <button
              type="button"
              onClick={() => setShowPass((v) => !v)}
              aria-label={showPass ? "Hide password" : "Show password"}
              style={{
                position: "absolute",
                insetInlineEnd: 12,
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "var(--text-3)",
                padding: 4,
              }}
            >
              {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </div>

        <Link
          href="/dashboard"
          className="btn btn-glow"
          style={{
            width: "100%",
            justifyContent: "center",
            padding: "13px",
            marginTop: 8,
          }}
        >
          {t("auth.login.submit", l)}
          <ArrowRight size={15} aria-hidden="true" />
        </Link>
      </form>

      <p
        style={{
          textAlign: "center",
          marginTop: 24,
          fontSize: 14,
          color: "var(--text-3)",
        }}
      >
        {t("auth.login.noAccount", l)}{" "}
        <Link
          href="/register"
          style={{
            color: "var(--brand)",
            fontWeight: 600,
            textDecoration: "none",
          }}
        >
          {t("auth.login.register", l)}
        </Link>
      </p>
    </div>
  );
}
