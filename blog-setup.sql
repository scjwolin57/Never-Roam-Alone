-- =====================================================================
-- BLOG-SETUP.SQL — run this ONCE in Supabase (SQL Editor → New query →
-- paste → Run). It creates everything the blog editor needs:
--
--   1. A "blog_admins" list of who may write articles (starts with Jeff).
--      To add a writer later: add one INSERT line with their email.
--   2. A "blog_posts" table where articles live. Everyone can READ
--      published articles; only admins can create/edit/delete, and only
--      admins can see drafts.
--   3. A public "blog-images" storage folder for photos you upload in
--      the editor. Anyone can view the photos; only admins can add or
--      remove them.
--
-- Safe to re-run: every statement skips or replaces what already exists.
-- =====================================================================

-- ---------- 1. Who is allowed to manage the blog ----------
create table if not exists public.blog_admins (
  email text primary key
);
alter table public.blog_admins enable row level security;

insert into public.blog_admins (email) values ('jcwolinsky@gmail.com')
on conflict (email) do nothing;

-- Helper the rules below (and the admin pages) use: "is the person
-- making this request on the admin list?"
create or replace function public.is_blog_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.blog_admins
    where lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

grant execute on function public.is_blog_admin() to anon, authenticated;

-- Admins may see the admin list itself (nobody else can).
drop policy if exists "admins can read admin list" on public.blog_admins;
create policy "admins can read admin list" on public.blog_admins
  for select using (public.is_blog_admin());

-- ---------- 2. The articles table ----------
create table if not exists public.blog_posts (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique not null,
  title       text not null,
  tag         text,
  location    text,
  date        date not null default current_date,
  seed        text,                       -- fallback word for placeholder photos
  cover       jsonb,                      -- {url, credit, creditLink} chosen cover photo
  excerpt     text,
  body        jsonb not null default '[]'::jsonb,  -- article blocks, same shape as posts.js
  likes       integer not null default 0,
  views       integer not null default 0,
  published   boolean not null default false,
  author_id   uuid references auth.users (id) on delete set null,
  author_name text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

alter table public.blog_posts enable row level security;

-- Keep updated_at current automatically.
create or replace function public.blog_posts_touch()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
drop trigger if exists blog_posts_touch on public.blog_posts;
create trigger blog_posts_touch before update on public.blog_posts
  for each row execute function public.blog_posts_touch();

-- Everyone (even signed-out visitors) can read PUBLISHED articles.
drop policy if exists "anyone reads published posts" on public.blog_posts;
create policy "anyone reads published posts" on public.blog_posts
  for select using (published = true or public.is_blog_admin());

-- Only admins can create, edit, or delete.
drop policy if exists "admins insert posts" on public.blog_posts;
create policy "admins insert posts" on public.blog_posts
  for insert with check (public.is_blog_admin());

drop policy if exists "admins update posts" on public.blog_posts;
create policy "admins update posts" on public.blog_posts
  for update using (public.is_blog_admin()) with check (public.is_blog_admin());

drop policy if exists "admins delete posts" on public.blog_posts;
create policy "admins delete posts" on public.blog_posts
  for delete using (public.is_blog_admin());

-- ---------- 3. Photo storage for uploaded images ----------
insert into storage.buckets (id, name, public)
values ('blog-images', 'blog-images', true)
on conflict (id) do nothing;

drop policy if exists "public reads blog images" on storage.objects;
create policy "public reads blog images" on storage.objects
  for select using (bucket_id = 'blog-images');

drop policy if exists "admins upload blog images" on storage.objects;
create policy "admins upload blog images" on storage.objects
  for insert with check (bucket_id = 'blog-images' and public.is_blog_admin());

drop policy if exists "admins update blog images" on storage.objects;
create policy "admins update blog images" on storage.objects
  for update using (bucket_id = 'blog-images' and public.is_blog_admin());

drop policy if exists "admins delete blog images" on storage.objects;
create policy "admins delete blog images" on storage.objects
  for delete using (bucket_id = 'blog-images' and public.is_blog_admin());
