-- Never Roam Alone — visitor-contributed landmark photos
-- Run in the Supabase SQL editor. Pairs with the "Contribute Image" form on
-- the landmark cards in city.html.

create table if not exists public.landmark_photo_contributions (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  city          text not null,
  country       text,
  landmark      text not null,
  landmark_idx  int,
  storage_path  text not null,
  taken_month   int  check (taken_month between 1 and 12),
  taken_year    int  check (taken_year between 1900 and 2100),
  credit_mode   text not null check (credit_mode in ('name','profile','none')),
  credit_name   text,
  work_url      text,
  rights_confirmed boolean not null default false,
  submitted_by  uuid references auth.users(id) on delete set null,
  status        text not null default 'pending' check (status in ('pending','approved','rejected')),
  review_note   text
);

create index if not exists lpc_status_idx on public.landmark_photo_contributions (status, created_at desc);
create index if not exists lpc_city_idx   on public.landmark_photo_contributions (city);

alter table public.landmark_photo_contributions enable row level security;

-- No client-side inserts at all: submissions come through the
-- contribute-photo Netlify function, which writes with the service key
-- (service-role bypasses RLS). Nothing else may write to this table.

-- Contributors can see their own submissions; nobody else can read the table.
drop policy if exists lpc_read_own on public.landmark_photo_contributions;
create policy lpc_read_own on public.landmark_photo_contributions
  for select to authenticated
  using (submitted_by = auth.uid());

-- Storage bucket for the uploaded originals (private — review before publishing).
insert into storage.buckets (id, name, public)
values ('landmark-contributions', 'landmark-contributions', false)
on conflict (id) do nothing;

-- Likewise no client-side uploads: the function stores the file with the
-- service key. The bucket stays private, with no public policy at all.
