# Database setup

Four migrations, applied in order:

1. `20260722000001_schema.sql` — tables (`profiles`, `professional_profiles`, `professional_documents`, `pending_edits`, `favorites`).
2. `20260722000002_functions.sql` — `is_admin()`, the `on_auth_user_created` trigger, and the admin RPCs (`approve_professional_request`, `reject_professional_request`, `approve_pending_edit`, `reject_pending_edit`, `set_user_status`, `increment_professional_view`).
3. `20260722000003_rls.sql` — Row Level Security policies for every table.
4. `20260722000004_storage.sql` — the `id-documents` (private) and `work-photos` (public-once-approved) Storage buckets + their policies.

## Apply

**Option A — Supabase CLI** (recommended once the project is linked):

```bash
supabase link --project-ref <your-project-ref>
supabase db push
```

**Option B — SQL editor**: paste each file's contents into the Supabase Dashboard's SQL editor, in filename order, and run.

## After applying

- Enable email OTP/confirmation in Authentication → Providers (Email) — "Confirm email" on.
- Set `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` in `.env.local` (see `.env.example`).
- Create the first admin manually: sign up normally, then in the SQL editor run
  `update public.profiles set role = 'admin' where email = '...';`
