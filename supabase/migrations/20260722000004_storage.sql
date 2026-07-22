-- Storage buckets for ID documents (never public) and work photos (public
-- read once the owning professional is approved). Both buckets are created
-- private; "public" read for work photos is granted via the SELECT policy
-- below (scoped to `anon` + `authenticated`), not the bucket-level public flag.
--
-- Upload path convention: `{professional_id}/{filename}`, enforced by the
-- policies via `(storage.foldername(name))[1]`.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('id-documents', 'id-documents', false, 5242880, array['image/jpeg', 'image/png', 'image/webp']),
  ('work-photos', 'work-photos', false, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do nothing;

-- id-documents: owner (professional) + admin only, never public.

create policy "id-documents: insert own"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'id-documents'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "id-documents: read own or admin"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'id-documents'
    and (
      (storage.foldername(name))[1] = auth.uid()::text
      or public.is_admin()
    )
  );

-- work-photos: owner can upload; readable by anyone once the professional is approved.

create policy "work-photos: insert own"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'work-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "work-photos: read own, admin, or approved"
  on storage.objects for select
  to anon, authenticated
  using (
    bucket_id = 'work-photos'
    and (
      (storage.foldername(name))[1] = auth.uid()::text
      or public.is_admin()
      or exists (
        select 1 from public.professional_profiles pp
        where pp.id::text = (storage.foldername(name))[1] and pp.status = 'approved'
      )
    )
  );
