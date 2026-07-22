# أبشر (Absher) — منصة الخدمات المهنية

Two-sided services marketplace PWA connecting professionals (plumbers, electricians, carpenters, ...) with customers searching by profession and city. Next.js (App Router) + TypeScript + Tailwind CSS v4 + Framer Motion, backed by Supabase (Auth, Postgres with RLS, Storage).

## Stack

- Next.js 16 (App Router, Turbopack) + React 19 + TypeScript
- Tailwind CSS v4 (tokens defined in `src/app/globals.css` under `@theme`)
- Motion (Framer Motion) for the splash sequence and transitions
- Supabase: Auth, Postgres + Row Level Security, Storage
- react-hook-form + zod for form validation
- PWA: `src/app/manifest.ts` + a hand-rolled service worker

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Project structure

```
src/
  app/
    (auth)/        # login, signup, professional signup, OTP, pending-review
    (app)/          # customer/professional shell: home, search, favorites, account, profile detail
    (admin)/admin/  # admin console: requests, edits, users
  components/
    ui/             # design system primitives
    layout/         # BottomNav
    admin/          # AdminSidebar
    professionals/  # ProfessionalRow
    favorites/      # FavoritesProvider
    splash/         # SplashScreen
  lib/
    auth/           # session helpers (TODO: wire to Supabase)
    mock/           # mock data used before Supabase is connected
    validation/      # zod schemas
    utils/
  types/            # shared domain types
supabase/
  migrations/       # SQL schema + RLS policies
```

## Environment variables

Copy `.env.example` to `.env.local` and fill in your Supabase project credentials:

```bash
cp .env.example .env.local
```

## Status

UI for all screens is built against mock data. Supabase Auth/data wiring, RLS policies, and PWA service worker are tracked as the next milestones — see `TODO(supabase)` comments throughout the codebase for exactly what each one replaces.
