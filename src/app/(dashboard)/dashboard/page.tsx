/**
 * @file app/(dashboard)/dashboard/page.tsx
 * @description ORAX Dashboard overview with real data.
 */

"use client";

import { useEffect, useState } from "react";
import { useTheme } from "@/components/providers/theme-provider";
import { useSession } from "next-auth/react";
import { t } from "@/i18n";
import { TrendingUp, Users, DollarSign, Activity } from "lucide-react";

// Fallback data for UI consistency (in case of no data from API)
const barHeights = [38, 55, 42, 70, 52, 84, 63, 88, 58, 80, 72, 100];
const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const fallbackStats = [
  {
    labelKey: "dash.revenue" as const,
    deltaKey: "dash.dRevDelta" as const,
    icon: DollarSign,
    value: "$0",
    deltaPos: true,
  },
  {
    labelKey: "dash.users" as const,
    deltaKey: "dash.dUsrDelta" as const,
    icon: Users,
    value: "0",
    deltaPos: true,
  },
  {
    labelKey: "dash.mrr" as const,
    deltaKey: "dash.dMrrDelta" as const,
    icon: TrendingUp,
    value: "$0",
    deltaPos: true,
  },
  {
    labelKey: "dash.churn" as const,
    deltaKey: "dash.dChuDelta" as const,
    icon: Activity,
    value: "0%",
    deltaPos: false,
  },
];

const fallbackRows = [
  {
    name: "",
    plan: "",
    amount: "",
    statusKey: "dash.active" as const,
    date: "",
  },
];

export default function DashboardPage(): React.JSX.Element {
  const { locale, mounted } = useTheme();
  const { data: session } = useSession();
  const l = mounted ? locale : "en";

  // State to store data from API
  const [stats, setStats] = useState<null | {
    userCount: number;
    subscriptionsCount: number;
    revenue: number;
    recent: {
      customer: string;
      plan: string;
      status: string;
      price: number;
      createdAt: string | null;
    }[];
  }>(null);

  useEffect(() => {
    const fetchStats = async (): Promise<void> => {
      try {
        const res = await fetch("/api/dashboard");
        if (res.ok) {
          const json = await res.json();
          setStats(json);
        }
      } catch (error) {
        console.error("[dashboard][fetch]", error);
      }
    };
    fetchStats();
  }, []);

  // Building the stats array from actual data or fallback
  const dynamicStats = stats
    ? [
        {
          labelKey: "dash.revenue" as const,
          deltaKey: "dash.dRevDelta" as const,
          icon: DollarSign,
          value: `$${stats.revenue.toLocaleString()}`,
          deltaPos: true,
        },
        {
          labelKey: "dash.users" as const,
          deltaKey: "dash.dUsrDelta" as const,
          icon: Users,
          value: stats.userCount.toLocaleString(),
          deltaPos: true,
        },
        {
          labelKey: "dash.mrr" as const,
          deltaKey: "dash.dMrrDelta" as const,
          icon: TrendingUp,
          value: `$${stats.revenue.toLocaleString()}`, // Temporarily considering MRR = total revenue
          deltaPos: true,
        },
        {
          labelKey: "dash.churn" as const,
          deltaKey: "dash.dChuDelta" as const,
          icon: Activity,
          value: "0%", // We haven't calculated churn rate yet
          deltaPos: false,
        },
      ]
    : fallbackStats;

  // Mapping subscription statuses to translation keys
  const statusKeyMap: Record<string, string> = {
    active: "dash.active",
    trialing: "dash.trial",
    // Can add other keys like canceled/past_due when adding their translations
  };

  // Converting recent subscriptions to table rows
  const dynamicRows = stats
    ? stats.recent.map((row) => {
        const dateObj = row.createdAt ? new Date(row.createdAt) : null;
        const date = dateObj
          ? dateObj.toLocaleDateString(l, { month: "short", day: "numeric" })
          : "";
        return {
          name: row.customer,
          plan: row.plan.charAt(0).toUpperCase() + row.plan.slice(1),
          amount: `$${row.price}`,
          statusKey: statusKeyMap[row.status] ?? "dash.active",
          date,
        };
      })
    : fallbackRows;

  // Using username for greeting
  const userName = session?.user?.name || "User";
  const welcomeText = t("dash.welcome", l, { name: userName });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
      {/* Header */}
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

      {/* Stats Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: 16,
        }}
      >
        {dynamicStats.map(
          ({ labelKey, deltaKey, icon: Icon, value, deltaPos }) => (
            <div
              key={labelKey}
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: 16,
                padding: 20,
                transition: "border-color 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--border-glow)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--border)";
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
                  {t(labelKey, l)}
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
                  marginBottom: 6,
                }}
              >
                {value}
              </p>
              <p
                style={{
                  fontSize: 12,
                  color: deltaPos ? "var(--green)" : "var(--red)",
                }}
              >
                {t(deltaKey, l)}
              </p>
            </div>
          ),
        )}
      </div>

      {/* Chart */}
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
            marginBottom: 24,
          }}
        >
          {t("dash.chart", l)}
        </p>
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            gap: 8,
            height: 160,
          }}
        >
          {barHeights.map((h, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 6,
                height: "100%",
                justifyContent: "flex-end",
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: `${h}%`,
                  borderRadius: "6px 6px 4px 4px",
                  background:
                    i === 11
                      ? "var(--brand)"
                      : `rgba(99,102,241,${0.15 + (h / 100) * 0.4})`,
                  boxShadow:
                    i === 11 ? "0 0 12px rgba(99,102,241,0.4)" : "none",
                  transition: "all 0.3s",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "var(--brand)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background =
                    i === 11
                      ? "var(--brand)"
                      : `rgba(99,102,241,${0.15 + (h / 100) * 0.4})`;
                }}
              />
              <span
                style={{
                  fontSize: 10,
                  color: "var(--text-3)",
                  fontFamily: "var(--font-mono)",
                }}
              >
                {months[i]}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Table */}
      <div
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: 20,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "20px 24px",
            borderBottom: "1px solid var(--border)",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 16,
              fontWeight: 700,
              color: "var(--text-1)",
            }}
          >
            {t("dash.recent", l)}
          </p>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)" }}>
                {[
                  "dash.hCustomer",
                  "dash.hPlan",
                  "dash.hAmount",
                  "dash.hStatus",
                  "dash.hDate",
                ].map((hKey) => (
                  <th
                    key={hKey}
                    style={{
                      padding: "12px 24px",
                      textAlign: "start",
                      fontSize: 11,
                      fontFamily: "var(--font-mono)",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "var(--text-3)",
                      fontWeight: 500,
                    }}
                  >
                    {t(hKey, l)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {dynamicRows.map((row, i) => (
                <tr
                  key={i}
                  style={{
                    borderBottom:
                      i < dynamicRows.length - 1
                        ? "1px solid var(--border)"
                        : "none",
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.02)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                  }}
                >
                  <td
                    style={{
                      padding: "14px 24px",
                      fontSize: 14,
                      fontWeight: 600,
                      color: "var(--text-1)",
                    }}
                  >
                    {row.name}
                  </td>
                  <td
                    style={{
                      padding: "14px 24px",
                      fontSize: 13,
                      color: "var(--text-2)",
                    }}
                  >
                    {row.plan}
                  </td>
                  <td
                    style={{
                      padding: "14px 24px",
                      fontSize: 14,
                      fontWeight: 600,
                      color: "var(--text-1)",
                      fontFamily: "var(--font-mono)",
                    }}
                  >
                    {row.amount}
                  </td>
                  <td style={{ padding: "14px 24px" }}>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        fontFamily: "var(--font-mono)",
                        padding: "3px 10px",
                        borderRadius: 999,
                        color:
                          row.statusKey === "dash.active"
                            ? "var(--green)"
                            : "var(--amber)",
                        background:
                          row.statusKey === "dash.active"
                            ? "rgba(34,197,94,0.1)"
                            : "rgba(255,140,66,0.1)",
                        border: `1px solid ${
                          row.statusKey === "dash.active"
                            ? "rgba(34,197,94,0.2)"
                            : "rgba(255,140,66,0.2)"
                        }`,
                      }}
                    >
                      {t(row.statusKey, l)}
                    </span>
                  </td>
                  <td
                    style={{
                      padding: "14px 24px",
                      fontSize: 13,
                      color: "var(--text-3)",
                    }}
                  >
                    {row.date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
