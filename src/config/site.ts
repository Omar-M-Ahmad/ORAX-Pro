/**
 * @file src/config/site.ts
 * @description Central SEO and site configuration for ORAX.
 */

export const siteConfig = {
  name: "ORAX",
  title: "ORAX Pro - Arabic Ready SaaS Starter System",
  description:
    "ORAX Pro is a modern SaaS starter system with real RTL support, bilingual foundation (Arabic + English), and clean architecture for scalable products.",
  url:
    process.env.NEXT_PUBLIC_APP_URL?.trim() || "http://localhost:3000",
  ogImage: "/og-image.png",
  pricing: {
    free: 0,
    starter: 49,
    pro: 99,
  },
  links: {
    twitter: "https://x.com/omar_m_ahmad",
    linkedin: "https://www.linkedin.com/in/omar-mahmoud-ahmad",
    github: "https://github.com/Omar-M-Ahmad",
  },
} as const;
