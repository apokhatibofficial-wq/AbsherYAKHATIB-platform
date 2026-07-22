-- Helper + RPC functions. All admin-mutation RPCs are SECURITY DEFINER so RLS
-- can stay restrictive on the underlying tables (clients never UPDATE
-- professional_profiles/pending_edits/profiles directly for these actions).

create function public.is_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- Creates the public.profiles row whenever a new Supabase Auth user is created.
-- Expects `full_name` and (optionally) `role` in the signUp() options.data payload.
create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, role, full_name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'role', 'customer'),
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    new.email
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Public RPC: increments a profile's view counter. Safe to expose to
-- anon/authenticated since it only touches a non-sensitive counter and is
-- scoped to already-approved profiles.
create function public.increment_professional_view(p_professional_id uuid)
returns void
language sql
security definer
set search_path = public
as $$
  update public.professional_profiles
  set view_count = view_count + 1
  where id = p_professional_id and status = 'approved';
$$;

create function public.approve_professional_request(p_professional_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'not authorized';
  end if;

  update public.professional_profiles
  set status = 'approved', reviewed_at = now()
  where id = p_professional_id and status = 'pending_review';
end;
$$;

create function public.reject_professional_request(p_professional_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'not authorized';
  end if;

  update public.professional_profiles
  set status = 'rejected', reviewed_at = now()
  where id = p_professional_id and status = 'pending_review';
end;
$$;

-- Copies the approved value onto the live professional_profiles row.
-- `field` is restricted to a fixed allow-list rather than used as a dynamic
-- identifier, to rule out SQL injection via arbitrary column names.
create function public.approve_pending_edit(p_edit_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_edit record;
begin
  if not public.is_admin() then
    raise exception 'not authorized';
  end if;

  select * into v_edit from public.pending_edits where id = p_edit_id and status = 'pending';
  if not found then
    raise exception 'edit not found or already resolved';
  end if;

  if v_edit.field = 'description' then
    update public.professional_profiles set description = v_edit.new_value where id = v_edit.professional_id;
  elsif v_edit.field = 'phone' then
    update public.professional_profiles set phone = v_edit.new_value where id = v_edit.professional_id;
  else
    raise exception 'unsupported field: %', v_edit.field;
  end if;

  update public.pending_edits set status = 'approved', reviewed_at = now() where id = p_edit_id;
end;
$$;

create function public.reject_pending_edit(p_edit_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'not authorized';
  end if;

  update public.pending_edits
  set status = 'rejected', reviewed_at = now()
  where id = p_edit_id and status = 'pending';
end;
$$;

create function public.set_user_status(p_user_id uuid, p_status text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'not authorized';
  end if;
  if p_status not in ('active', 'suspended') then
    raise exception 'invalid status: %', p_status;
  end if;

  update public.profiles set status = p_status where id = p_user_id;
end;
$$;
