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

1. Create a Supabase project, then apply the SQL migrations — see `supabase/README.md`.
2. `cp .env.example .env.local` and fill in your Supabase project URL + keys.
3. `npm install && npm run dev`, open http://localhost:3000.

Without step 1–2, the splash screen and auth pages (`/login`, `/signup`, `/signup/professional`, `/verify-otp`, `/pending`) still render, but every page past login needs a real Supabase backend to load data.

## Project structure

```
src/
  app/
    (auth)/         # login, signup, professional signup, OTP, pending-review
    (app)/          # customer/professional shell: home, search, favorites, account, profile detail
    (admin)/admin/  # admin console: requests, edits, users
  components/
    ui/             # design system primitives
    layout/         # BottomNav
    admin/          # AdminSidebar
    professionals/  # ProfessionalRow
    favorites/      # FavoritesProvider (Supabase-backed)
    splash/         # SplashScreen
  lib/
    auth/           # session helper (getCurrentUser)
    supabase/       # client.ts (browser), server.ts (RSC/actions), admin.ts (service-role), queries.ts, types.ts
    validation/     # zod schemas
    utils/
  types/            # shared domain types
  proxy.ts          # session refresh + route guards (Next.js 16's renamed middleware.ts)
supabase/
  migrations/       # SQL schema + RLS policies + storage buckets
```

## Environment variables

See `.env.example` — `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`.

## Status

All screens are built and wired to Supabase: Auth (email/password + OTP confirmation), Postgres queries under RLS, Storage uploads (ID documents + work photos), and the admin approve/reject RPCs. See `supabase/README.md` to apply the migrations and connect a project.
