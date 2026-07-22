-- Absher marketplace: core schema.

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role text not null default 'customer' check (role in ('customer', 'professional', 'admin')),
  full_name text not null,
  email text not null,
  status text not null default 'active' check (status in ('active', 'suspended')),
  created_at timestamptz not null default now()
);

create table public.professional_profiles (
  id uuid primary key references public.profiles (id) on delete cascade,
  full_name text not null,
  profession text not null check (
    profession in ('سباك', 'كهربائي', 'نجار', 'دهان', 'تكييف وتبريد', 'نظافة')
  ),
  city text not null check (city in ('الرياض', 'جدة', 'الدمام', 'مكة المكرمة')),
  phone text not null,
  description text not null default '',
  view_count integer not null default 0,
  status text not null default 'pending_review' check (
    status in ('pending_review', 'approved', 'rejected')
  ),
  submitted_at timestamptz not null default now(),
  reviewed_at timestamptz
);

create index professional_profiles_status_city_idx
  on public.professional_profiles (status, city);

create table public.professional_documents (
  id uuid primary key default gen_random_uuid(),
  professional_id uuid not null references public.professional_profiles (id) on delete cascade,
  kind text not null check (kind in ('id_front', 'id_back', 'work_photo')),
  storage_path text not null,
  created_at timestamptz not null default now()
);

create index professional_documents_professional_id_idx
  on public.professional_documents (professional_id);

create table public.pending_edits (
  id uuid primary key default gen_random_uuid(),
  professional_id uuid not null references public.professional_profiles (id) on delete cascade,
  field text not null,
  old_value text,
  new_value text not null,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  submitted_at timestamptz not null default now(),
  reviewed_at timestamptz
);

create index pending_edits_professional_id_idx
  on public.pending_edits (professional_id);

create table public.favorites (
  customer_id uuid not null references public.profiles (id) on delete cascade,
  professional_id uuid not null references public.professional_profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (customer_id, professional_id)
);
