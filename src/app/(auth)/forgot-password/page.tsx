/**
 * @file src/app/(auth)/forgot-password/page.tsx
 * @description Forgot password page for requesting a reset link.
 */

"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";

import { useTheme } from "@/components/providers/theme-provider";
import { t } from "@/i18n";

export default function ForgotPasswordPage(): React.JSX.Element {
  const { locale, mounted } = useTheme();
  const l = mounted ? locale : "en";

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const inp: React.CSSProperties = {
    width: "100%",
    padding: "11px 14px",
    borderRadius: 10,
    border: "1px solid var(--border)",
    background: "var(--bg-1)",
    color: "var(--text-1)",
    fontSize: 14,
    outline: "none",
    boxSizing: "border-box",
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || t("auth.forgot.failed", l));
      }

      setSuccess(true);
    } catch (err) {
      console.error("[forgot-password]", err);
      setError(t("auth.forgot.failed", l));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg-0)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 420,
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: 20,
          padding: 32,
        }}
      >
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 28,
            fontWeight: 800,
            color: "var(--text-1)",
            marginBottom: 8,
          }}
        >
          {t("auth.forgot.title", l)}
        </h1>

        <p style={{ color: "var(--text-3)", fontSize: 14, marginBottom: 24 }}>
          {t("auth.forgot.subtitle", l)}
        </p>

        {error && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "12px 14px",
              background: "rgba(239,68,68,0.1)",
              border: "1px solid rgba(239,68,68,0.3)",
              borderRadius: 10,
              marginBottom: 16,
              color: "var(--red)",
              fontSize: 13,
            }}
          >
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        {success ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "12px 14px",
              background: "rgba(34,197,94,0.1)",
              border: "1px solid rgba(34,197,94,0.3)",
              borderRadius: 10,
              color: "var(--green)",
              fontSize: 13,
            }}
          >
            <CheckCircle2 size={16} />
            {t("auth.forgot.success", l)}
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: 16 }}
          >
            <div>
              <label
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
              <div style={{ position: "relative" }}>
                <Mail
                  size={15}
                  style={{
                    position: "absolute",
                    top: "50%",
                    insetInlineStart: 12,
                    transform: "translateY(-50%)",
                    color: "var(--text-3)",
                  }}
                />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  style={{
                    ...inp,
                    paddingInlineStart: 38,
                  }}
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-glow"
              disabled={loading}
              style={{
                width: "100%",
                justifyContent: "center",
                padding: "13px",
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? (
                t("common.loading", l)
              ) : (
                <>
                  {t("auth.forgot.submit", l)}
                  <ArrowRight size={15} />
                </>
              )}
            </button>
          </form>
        )}

        <p
          style={{
            textAlign: "center",
            marginTop: 20,
            fontSize: 14,
            color: "var(--text-3)",
          }}
        >
          <Link
            href="/login"
            style={{
              color: "var(--brand)",
              textDecoration: "none",
              fontWeight: 600,
            }}
          >
            {t("auth.forgot.back", l)}
          </Link>
        </p>
      </div>
    </div>
  );
}
