# ORAX Pro

> **Arabic-ready SaaS starter that is actually production-minded**  
> Next.js App Router + Auth + DB + Protected Routes + Bilingual UX (EN/AR, LTR/RTL).

![ORAX](./public/og-image.png)

---

## Why ORAX Pro?

Most starters are either:
- beautiful but fake (no real backend flow), or
- technical but poor in UX and bilingual support.

**ORAX Pro is built to bridge both sides**:
- polished product UI,
- real authentication and database foundation,
- Arabic credibility from day one.

---

## What makes it different from ORAX Free?

### ORAX Free
- Landing + design system direction
- UI exploration
- Great for evaluation and inspiration

### ORAX Pro (this repo)
- Real auth flows (credentials + OAuth + reset password)
- DB-backed modules and API routes
- Protected app routes (dashboard/settings/billing)
- User settings persistence
- Billing foundation wired to subscription data model

---

## Core Features

- ✅ Next.js 16 App Router
- ✅ TypeScript
- ✅ NextAuth v5 + Drizzle Adapter
- ✅ Credentials + Google + GitHub login
- ✅ Forgot/reset password flows
- ✅ Protected routes via edge proxy
- ✅ Dashboard / Settings / Billing modules
- ✅ English + Arabic messages
- ✅ LTR + RTL layout support
- ✅ Clean architecture by domain modules

---

## Architecture (simple and scalable)

```txt
src/
  app/
    [locale]/
      (auth)/
      (dashboard)/
    api/
  components/
  modules/
    billing/server/
    dashboard/server/
    settings/server/
  lib/
    auth/
    db/
    email/
    tokens/
  i18n/
  config/
```

### Architectural philosophy
- `app/` = routing and page composition
- `modules/` = domain server logic
- `lib/` = infrastructure (auth, db, email, tokens)
- `components/` = reusable UI/view layer

This keeps the codebase easier to maintain as product complexity grows.

---

## Real vs UI-ready boundaries

### Real now
- Authentication/session management
- Route protection
- User profile/settings updates
- Billing API + billing page reading subscription records

### UI-ready next
- Stripe/Lemon Squeezy payment checkout
- Billing webhooks and full external sync
- Advanced admin analytics

---

## SEO & Metadata

Dashboard pages include explicit page metadata titles/descriptions for better indexing clarity:
- Dashboard
- Billing
- Settings

> Note: these pages are protected and primarily user-app pages, but metadata is still defined for consistency and SEO hygiene.

---

## Quick Start

```bash
pnpm install
pnpm dev
```

Open: `http://localhost:3000`

---

## Environment Variables

Create `.env.local` and set at minimum:

```bash
DATABASE_URL=
AUTH_SECRET=
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Optional OAuth
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=

# Optional: enable dangerous same-email OAuth account linking
AUTH_ALLOW_EMAIL_ACCOUNT_LINKING=false
```

---

## Customization Guide

### Brand and pricing
- `src/config/site.ts`

### Translations
- `src/i18n/messages/en.json`
- `src/i18n/messages/ar.json`

### Product pages / UI
- `src/components/*`
- `src/app/[locale]/*`

### Business logic
- `src/modules/*/server/*`

---

## Recommended next moves for production

1. Integrate payment provider checkout + webhook flow.
2. Add audit logs for sensitive account actions.
3. Add admin module if global analytics are required.
4. Add E2E tests for auth + locale-critical flows.

---

## License

Commercial/premium template. Redistribution or resale is not allowed.
