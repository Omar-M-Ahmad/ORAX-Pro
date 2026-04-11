/**
 * @file src/components/dashboard/dashboard-view.tsx
 * @description Dashboard view with starter showcase data.
 */

"use client";

import { Activity, FolderKanban, Layers3 } from "lucide-react";
import { useLocale } from "@/components/providers/locale-provider";
import { t } from "@/i18n";
import type { DashboardPageData } from "@/modules/dashboard/server/get-dashboard-page-data";

type DashboardViewProps = {
  data: DashboardPageData;
};

function formatNumber(value: number): string {
  return value.toLocaleString("en-US");
}

function formatDate(value: Date | null): string {
  if (!value) return "-";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
  }).format(value);
}

export default function DashboardView({
  data,
}: DashboardViewProps): React.JSX.Element {
  const { locale: l } = useLocale();
  const welcomeText = t("dash.welcome", l, { name: data.userName });

  const stats = [
    {
      label: t("dash.cards.activeSubscriptions", l),
      icon: Layers3,
      value: formatNumber(data.stats.activeSubscriptions),
    },
    {
      label: t("dash.cards.showcaseProjects", l),
      icon: FolderKanban,
      value: formatNumber(data.stats.showcaseProjects),
    },
    {
      label: t("dash.cards.usageEvents", l),
      icon: Activity,
      value: formatNumber(data.stats.showcaseUsage),
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
      <div>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 28,
            fontWeight: 800,
            letterSpacing: "-0.03em",
            color: "var(--text-1)",
            marginBottom: 4,
          }}
        >
          {t("dash.heading", l)}
        </h1>
        <p style={{ color: "var(--text-3)", fontSize: 14 }}>{welcomeText}</p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          gap: 16,
        }}
      >
        {stats.map(({ label, icon: Icon, value }) => (
          <div
            key={label}
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: 16,
              padding: 20,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 12,
              }}
            >
              <p
                style={{
                  fontSize: 13,
                  color: "var(--text-3)",
                  fontWeight: 500,
                }}
              >
                {label}
              </p>

              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 9,
                  background: "var(--brand-dim)",
                  border: "1px solid var(--brand-glow)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon size={15} color="var(--brand)" aria-hidden="true" />
              </div>
            </div>

            <p
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 26,
                fontWeight: 800,
                letterSpacing: "-0.03em",
                color: "var(--text-1)",
              }}
            >
              {value}
            </p>
          </div>
        ))}
      </div>

      <div
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: 20,
          padding: 28,
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 16,
            fontWeight: 700,
            color: "var(--text-1)",
            marginBottom: 18,
          }}
        >
          {t("dash.cards.recentSubscriptions", l)}
        </p>

        <div style={{ display: "grid", gap: 12 }}>
          {data.subscription.length === 0 ? (
            <p style={{ color: "var(--text-3)", fontSize: 14 }}>
              {t("dash.cards.emptySubscriptions", l)}
            </p>
          ) : (
            data.subscription.map((item) => (
              <div
                key={item.id}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1.5fr 1fr 1fr",
                  gap: 12,
                  padding: 14,
                  border: "1px solid var(--border)",
                  borderRadius: 14,
                }}
              >
                <div>
                  <p style={{ color: "var(--text-1)", fontWeight: 600 }}>
                    {item.plan}
                  </p>
                  <p style={{ color: "var(--text-3)", fontSize: 13 }}>
                    {formatDate(item.currentPeriodEnd)}
                  </p>
                </div>

                <p style={{ color: "var(--text-2)", fontSize: 14 }}>
                  {item.status}
                </p>

                <p style={{ color: "var(--text-2)", fontSize: 14 }}>
                  {item.currentPeriodEnd ? t("dash.cards.renewsSoon", l) : "-"}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
