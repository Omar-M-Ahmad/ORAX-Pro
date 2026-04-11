/**
 * @file app/(auth)/register/_form.tsx
 * @description Register form component for ORAX.
 */

"use client";

import { ArrowRight, Check, Eye, EyeOff, Zap } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

import { useLocale } from "@/components/providers/locale-provider";
import { type TKey, t } from "@/i18n";
import { SocialIcons } from "@/components/shared/icons";
import Input from "@/components/ui/input";

const perkKeys: TKey[] = ["auth.perk1", "auth.perk2", "auth.perk3"];

export default function RegisterForm(): React.JSX.Element {
  const { locale: l } = useLocale();
  const router = useRouter();
  const localizePath = (path: string) => `/${l}${path}`;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [isPending, setIsPending] = useState(false);

  async function handleRegister(
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> {
    e.preventDefault();

    setError("");
    setIsPending(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data?.message || t("auth.register.failed", l));
        setIsPending(false);
        return;
      }

      const loginResult = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      setIsPending(false);

      if (loginResult?.error) {
        router.push(localizePath("/login"));
        return;
      }

      router.push(localizePath("/dashboard"));
      router.refresh();
    } catch {
      setError(t("auth.common.unexpectedError", l));
      setIsPending(false);
    }
  }

  async function handleOAuthRegister(provider: "google" | "github") {
    setError("");
    await signIn(provider, {
      callbackUrl: localizePath("/dashboard"),
    });
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg-0)",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "60px 64px",
          borderInlineEnd: "1px solid var(--border)",
          background:
            "linear-gradient(135deg,rgba(99,102,241,0.05) 0%,transparent 60%)",
        }}
      >
        <Link
          href={localizePath("")}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 64,
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

        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 36,
            fontWeight: 800,
            letterSpacing: "-0.04em",
            color: "var(--text-1)",
            lineHeight: 1.1,
            marginBottom: 16,
          }}
        >
          {t("auth.register.headline1", l)}
          <br />
          <em
            style={{
              fontStyle: "italic",
              fontWeight: 300,
              color: "var(--brand)",
              WebkitTextFillColor: "var(--brand)",
            }}
          >
            {t("auth.register.headline2", l)}
          </em>
        </h2>

        <p
          style={{
            color: "var(--text-2)",
            fontSize: 15,
            lineHeight: 1.75,
            marginBottom: 48,
            maxWidth: 340,
          }}
        >
          {t("auth.register.subtitle", l)}
        </p>

        <ul
          style={{
            listStyle: "none",
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          {perkKeys.map((key) => (
            <li
              key={key}
              style={{ display: "flex", alignItems: "center", gap: 12 }}
            >
              <span
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: "50%",
                  background: "rgba(34,197,94,0.15)",
                  border: "1px solid rgba(34,197,94,0.3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Check size={12} color="#22c55e" />
              </span>
              <span style={{ fontSize: 14, color: "var(--text-2)" }}>
                {t(key, l)}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "60px 64px",
        }}
      >
        <div style={{ width: "100%", maxWidth: 400 }}>
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
            {t("auth.register.title", l)}
          </h1>

          <p style={{ color: "var(--text-3)", fontSize: 14, marginBottom: 32 }}>
            {t("auth.register.subtitle", l)}
          </p>

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
              onClick={() => handleOAuthRegister("github")}
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
            </button>

            <button
              type="button"
              onClick={() => handleOAuthRegister("google")}
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
            </button>
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
              }}
            >
              {t("auth.register.or", l)}
            </span>
            <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
          </div>

          <form
            onSubmit={handleRegister}
            style={{ display: "flex", flexDirection: "column", gap: 14 }}
          >
            <div>
              <label
                htmlFor="register-name"
                style={{
                  display: "block",
                  fontSize: 13,
                  fontWeight: 500,
                  color: "var(--text-2)",
                  marginBottom: 7,
                }}
              >
                {t("auth.register.name", l)}
              </label>
              <Input
                id="register-name"
                name="name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div>
              <label
                htmlFor="register-email"
                style={{
                  display: "block",
                  fontSize: 13,
                  fontWeight: 500,
                  color: "var(--text-2)",
                  marginBottom: 7,
                }}
              >
                {t("auth.login.email", l)}
              </label>
              <Input
                id="register-email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label
                htmlFor="register-password"
                style={{
                  display: "block",
                  fontSize: 13,
                  fontWeight: 500,
                  color: "var(--text-2)",
                  marginBottom: 7,
                }}
              >
                {t("auth.login.password", l)}
              </label>

              <div style={{ position: "relative" }}>
                <Input
                  id="register-password"
                  name="password"
                  type={showPass ? "text" : "password"}
                  placeholder={showPass ? "••••••••" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  aria-label={
                    showPass
                      ? t("auth.common.hidePassword", l)
                      : t("auth.common.showPassword", l)
                  }
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
                marginTop: 4,
                opacity: isPending ? 0.7 : 1,
                cursor: isPending ? "not-allowed" : "pointer",
              }}
            >
              {isPending ? t("common.loading", l) : t("auth.register.submit", l)}
              <ArrowRight size={15} aria-hidden="true" />
            </button>
          </form>

          <p
            style={{
              textAlign: "center",
              marginTop: 20,
              fontSize: 12,
              color: "var(--text-3)",
              lineHeight: 1.6,
            }}
          >
            {t("auth.register.terms", l)}{" "}
            <Link
              href={localizePath("/terms")}
              style={{ color: "var(--brand)", textDecoration: "none" }}
            >
              {t("auth.register.tos", l)}
            </Link>{" "}
            {t("auth.register.and", l)}{" "}
            <Link
              href={localizePath("/privacy")}
              style={{ color: "var(--brand)", textDecoration: "none" }}
            >
              {t("auth.register.privacy", l)}
            </Link>
          </p>

          <p
            style={{
              textAlign: "center",
              marginTop: 16,
              fontSize: 14,
              color: "var(--text-3)",
            }}
          >
            {t("auth.register.hasAccount", l)}{" "}
            <Link
              href={localizePath("/login")}
              style={{
                color: "var(--brand)",
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              {t("auth.register.signin", l)}
            </Link>
          </p>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          div[style*="grid-template-columns"], div[style*="gridTemplateColumns"] {
            grid-template-columns: 1fr !important;
          }
          div[style*="borderInlineEnd"] {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
