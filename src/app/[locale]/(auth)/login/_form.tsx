/**
 * @file app/(auth)/login/_form.tsx
 * @description Login form for ORAX.
 */

"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { ArrowRight, Eye, EyeOff } from "lucide-react";

import Input from "@/components/ui/input";
import { SocialIcons } from "@/components/shared/icons";
import { useLocale } from "@/components/providers/locale-provider";
import { t } from "@/i18n";

export default function LoginForm(): React.JSX.Element {
  const { locale: l } = useLocale();
  const router = useRouter();
  const localizePath = (path: string) => `/${l}${path}`;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [isPending, setIsPending] = useState(false);

  async function handleCredentialsLogin(
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> {
    e.preventDefault();

    setError("");
    setIsPending(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setIsPending(false);

    if (result?.error) {
      setError(t("auth.login.invalidCredentials", l));
      return;
    }

    router.push(localizePath("/dashboard"));
    router.refresh();
  }

  async function handleOAuthLogin(provider: "google" | "github") {
    setError("");
    await signIn(provider, {
      callbackUrl: localizePath("/dashboard"),
    });
  }

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
        <button
          type="button"
          onClick={() => handleOAuthLogin("github")}
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
          onClick={() => handleOAuthLogin("google")}
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
            letterSpacing: "0.08em",
          }}
        >
          {t("auth.login.or", l)}
        </span>
        <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
      </div>

      <form
        onSubmit={handleCredentialsLogin}
        style={{ display: "flex", flexDirection: "column", gap: 16 }}
      >
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
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
              href={localizePath("/forgot-password")}
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
            marginTop: 8,
            opacity: isPending ? 0.7 : 1,
            cursor: isPending ? "not-allowed" : "pointer",
          }}
        >
          {isPending ? t("common.loading", l) : t("auth.login.submit", l)}
          <ArrowRight size={15} aria-hidden="true" />
        </button>
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
          href={localizePath("/register")}
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
