/**
 * @file src/app/(auth)/reset-password/page.tsx
 * @description Reset password page using token from query string.
 */

"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, CheckCircle2, AlertCircle } from "lucide-react";

import { useTheme } from "@/components/providers/theme-provider";
import { t } from "@/i18n";

function ResetPasswordForm(): React.JSX.Element {
  const { locale, mounted } = useTheme();
  const l = mounted ? locale : "en";

  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
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
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || t("auth.reset.failed", l));
      }

      setSuccess(true);
      setTimeout(() => router.replace("/login"), 1500);
    } catch (err) {
      console.error("[reset-password]", err);
      setError(t("auth.reset.failed", l));
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div style={{ padding: 24, color: "var(--red)" }}>
        {t("auth.reset.invalidToken", l)}
      </div>
    );
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
          {t("auth.reset.title", l)}
        </h1>

        <p style={{ color: "var(--text-3)", fontSize: 14, marginBottom: 24 }}>
          {t("auth.reset.subtitle", l)}
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
            {t("auth.reset.success", l)}
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
                {t("auth.login.password", l)}
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPass ? "text" : "password"}
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{ ...inp, paddingInlineEnd: 40 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  style={{
                    position: "absolute",
                    top: "50%",
                    insetInlineEnd: 12,
                    transform: "translateY(-50%)",
                    border: "none",
                    background: "none",
                    color: "var(--text-3)",
                    cursor: "pointer",
                  }}
                >
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
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
              {loading ? t("common.loading", l) : t("auth.reset.submit", l)}
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

export default function ResetPasswordPage(): React.JSX.Element {
  return (
    <Suspense fallback={<div style={{ padding: 24 }}>Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
