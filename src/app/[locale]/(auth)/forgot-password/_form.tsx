/**
 * @file src/app/(auth)/forgot-password/_form.tsx
 * @description Forgot password form for ORAX.
 */

"use client";

import { ArrowRight, CheckCircle2, Mail } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useLocale } from "@/components/providers/locale-provider";
import { t } from "@/i18n";
import Input from "@/components/ui/input";

export default function ForgotPasswordForm(): React.JSX.Element {
  const { locale: l } = useLocale();

  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> {
    e.preventDefault();

    setError("");
    setIsPending(true);

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data?.error || "Something went wrong.");
        setIsPending(false);
        return;
      }

      setSuccess(true);
      setIsPending(false);
    } catch {
      setError("Something went wrong. Please try again.");
      setIsPending(false);
    }
  }

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
                htmlFor="forgot-email"
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
                <Input
                  id="forgot-email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  style={{ paddingInlineStart: 38 }}
                />
              </div>
            </div>

            {error ? (
              <p
                style={{
                  fontSize: 13,
                  color: "var(--red)",
                  margin: 0,
                }}
              >
                {error}
              </p>
            ) : null}

            <button
              type="submit"
              className="btn btn-glow"
              disabled={isPending}
              style={{
                width: "100%",
                justifyContent: "center",
                padding: "13px",
                opacity: isPending ? 0.7 : 1,
                cursor: isPending ? "not-allowed" : "pointer",
              }}
            >
              {isPending ? "Loading..." : t("auth.forgot.submit", l)}
              <ArrowRight size={15} />
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
