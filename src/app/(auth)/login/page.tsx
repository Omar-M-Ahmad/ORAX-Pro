/**
 * @file app/(auth)/login/page.tsx
 * @description ORAX Login page.
 * - All text from @/lib/i18n
 * - Connected to Auth.js v5 via signIn
 * - OAuth icons inline SVG
 */

"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Eye, EyeOff, Zap, ArrowRight, AlertCircle } from "lucide-react";
import { useTheme } from "@/components/providers/theme-provider";
import { t } from "@/i18n";

const GitHubIcon = (): React.JSX.Element => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
  </svg>
);

const GoogleIcon = (): React.JSX.Element => (
  <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
);

function LoginForm(): React.JSX.Element {
  const { locale, mounted } = useTheme();
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const l = mounted ? locale : "en";

  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleOAuthSignIn = async (
    provider: "github" | "google",
  ): Promise<void> => {
    setOauthLoading(provider);
    setError(null);

    try {
      // For OAuth, we use redirect: true to handle the OAuth flow
      await signIn(provider, {
        callbackUrl,
        redirect: true,
      });
    } catch (err) {
      console.error("[login] OAuth error:", err);
      setError("OAuth sign in failed");
      setOauthLoading(null);
    }
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      console.log("[login] signIn result:", result);

      if (result?.error) {
        setError("Invalid email or password");
        setLoading(false);
      } else if (result?.ok) {
        // Small delay to ensure session is set
        setTimeout(() => {
          router.push(callbackUrl);
          router.refresh();
        }, 100);
      } else {
        // No error but also not OK - unexpected state
        setError("Something went wrong. Please try again.");
        setLoading(false);
      }
    } catch (err) {
      console.error("[login] Error:", err);
      setError("Something went wrong");
      setLoading(false);
    }
  };

  const inp: React.CSSProperties = {
    width: "100%",
    padding: "11px 14px",
    borderRadius: 10,
    border: "1px solid var(--border)",
    background: "var(--bg-1)",
    color: "var(--text-1)",
    fontSize: 14,
    outline: "none",
    transition: "border-color 0.2s",
    boxSizing: "border-box",
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
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* BG */}
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
          backgroundImage: `linear-gradient(rgba(99,102,241,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(99,102,241,0.03) 1px,transparent 1px)`,
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
        {/* Logo */}
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

        {/* Card */}
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

          {/* Error message */}
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
                marginBottom: 20,
                color: "var(--red)",
                fontSize: 13,
              }}
            >
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          {/* OAuth buttons */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 10,
              marginBottom: 28,
            }}
          >
            <button
              type="button"
              className="btn btn-ghost"
              style={{
                padding: "10px 16px",
                fontSize: 13,
                gap: 8,
                opacity: oauthLoading && oauthLoading !== "github" ? 0.5 : 1,
              }}
              onClick={() => handleOAuthSignIn("github")}
              disabled={!!oauthLoading}
            >
              {oauthLoading === "github" ? (
                <span style={{ animation: "spin 1s linear infinite" }}>⏳</span>
              ) : (
                <GitHubIcon />
              )}
              GitHub
            </button>
            <button
              type="button"
              className="btn btn-ghost"
              style={{
                padding: "10px 16px",
                fontSize: 13,
                gap: 8,
                opacity: oauthLoading && oauthLoading !== "google" ? 0.5 : 1,
              }}
              onClick={() => handleOAuthSignIn("google")}
              disabled={!!oauthLoading}
            >
              {oauthLoading === "google" ? (
                <span style={{ animation: "spin 1s linear infinite" }}>⏳</span>
              ) : (
                <GoogleIcon />
              )}
              Google
            </button>
          </div>

          {/* Divider */}
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

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: 16 }}
          >
            {/* Email */}
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
              <input
                name="email"
                type="email"
                required
                placeholder="you@example.com"
                style={inp}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "var(--brand)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "var(--border)";
                }}
              />
            </div>

            {/* Password */}
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
                <input
                  name="password"
                  type={showPass ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  style={{ ...inp, paddingInlineEnd: 40 }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "var(--brand)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "var(--border)";
                  }}
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

            {/* Submit */}
            <button
              type="submit"
              className="btn btn-glow"
              style={{
                width: "100%",
                justifyContent: "center",
                padding: "13px",
                marginTop: 8,
                opacity: loading ? 0.7 : 1,
              }}
              disabled={loading}
            >
              {loading ? (
                <span
                  style={{
                    display: "inline-block",
                    width: 16,
                    height: 16,
                    border: "2px solid rgba(255,255,255,0.3)",
                    borderTopColor: "#fff",
                    borderRadius: "50%",
                    animation: "spin 0.7s linear infinite",
                  }}
                />
              ) : (
                <>
                  {t("auth.login.submit", l)}
                  <ArrowRight size={15} aria-hidden="true" />
                </>
              )}
            </button>
          </form>

          {/* Register link */}
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
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export default function LoginPage(): React.JSX.Element {
  return (
    <Suspense
      fallback={
        <div
          style={{
            minHeight: "100vh",
            background: "var(--bg-0)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span style={{ color: "var(--text-3)" }}>Loading...</span>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
