-- Row Level Security. All admin mutations that need to bypass these
-- (approve/reject, status changes) go through the SECURITY DEFINER RPCs in
-- 20260722000002_functions.sql rather than broad UPDATE policies.

alter table public.profiles enable row level security;
alter table public.professional_profiles enable row level security;
alter table public.professional_documents enable row level security;
alter table public.pending_edits enable row level security;
alter table public.favorites enable row level security;

-- profiles ---------------------------------------------------------------

create policy "profiles: read own or admin"
  on public.profiles for select
  using (id = auth.uid() or public.is_admin());

-- No direct INSERT/UPDATE policy for authenticated users: rows are created
-- by the on_auth_user_created trigger, and status changes go through
-- set_user_status().

-- professional_profiles ---------------------------------------------------

create policy "professional_profiles: read approved, own, or admin"
  on public.professional_profiles for select
  using (status = 'approved' or id = auth.uid() or public.is_admin());

create policy "professional_profiles: insert own"
  on public.professional_profiles for insert
  with check (
    id = auth.uid()
    and exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'professional'
    )
  );

create policy "professional_profiles: admin update"
  on public.professional_profiles for update
  using (public.is_admin())
  with check (public.is_admin());

-- professional_documents ---------------------------------------------------

create policy "professional_documents: read own, approved work photos, or admin"
  on public.professional_documents for select
  using (
    professional_id = auth.uid()
    or public.is_admin()
    or (
      kind = 'work_photo'
      and exists (
        select 1 from public.professional_profiles pp
        where pp.id = professional_documents.professional_id and pp.status = 'approved'
      )
    )
  );

create policy "professional_documents: insert own"
  on public.professional_documents for insert
  with check (professional_id = auth.uid());

-- pending_edits -------------------------------------------------------------

create policy "pending_edits: read own or admin"
  on public.pending_edits for select
  using (professional_id = auth.uid() or public.is_admin());

create policy "pending_edits: insert own"
  on public.pending_edits for insert
  with check (professional_id = auth.uid());

-- No client UPDATE policy: resolved only via approve_pending_edit()/reject_pending_edit().

-- favorites -------------------------------------------------------------

create policy "favorites: read own"
  on public.favorites for select
  using (customer_id = auth.uid());

create policy "favorites: insert own"
  on public.favorites for insert
  with check (customer_id = auth.uid());

create policy "favorites: delete own"
  on public.favorites for delete
  using (customer_id = auth.uid());
