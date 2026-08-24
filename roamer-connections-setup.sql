-- =====================================================================
-- ROAMER-CONNECTIONS-SETUP.SQL — one-time setup for "Roamer's Connections",
-- the per-city message board that sits under "Roamers in town" on every
-- city guide page (Plate 07).
--
-- What this does, in plain English:
--   1. Creates four tables: posts, likes, replies and reports.
--   2. Anyone (even signed-out visitors) can READ posts and replies.
--      Only signed-in members can post, reply, like or report.
--      Authors can delete their own post or reply; nobody else can.
--   3. Keeps a running "like count" and "reply count" on each post so the
--      board can sort by Most liked without doing slow maths every time.
--   4. Adds safe read functions the city page calls:
--        city_connections(city, sort, limit, offset) → the posts
--        city_connection_replies(post_id)            → one post's replies
--      They join in the author's display name / photo but never expose
--      emails or any other private column.
--   5. Adds moderation: site admins (the same blog_admins list) can hide
--      any post or reply, and see everything members have reported, in
--      admin.html → Connections tab.
--
-- HOW TO RUN: Supabase → SQL Editor → New query → paste ALL of this →
-- Run. Safe to run more than once.
-- Needs supabase-setup.sql / profile-fields.sql (the profiles table) and
-- blog-setup.sql (the is_blog_admin() admin check) to have been run first.
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. POSTS
-- ---------------------------------------------------------------------
create table if not exists public.roamer_posts (
  id          uuid primary key default gen_random_uuid(),
  city        text        not null,
  user_id     uuid        not null references auth.users(id) on delete cascade,
  title       text        not null,
  body        text,
  tags        text[]      not null default '{}',
  like_count  integer     not null default 0,
  reply_count integer     not null default 0,
  is_hidden   boolean     not null default false,
  created_at  timestamptz not null default now()
);

create index if not exists roamer_posts_city_idx
  on public.roamer_posts (lower(city), created_at desc);
create index if not exists roamer_posts_city_likes_idx
  on public.roamer_posts (lower(city), like_count desc, created_at desc);
create index if not exists roamer_posts_tags_idx
  on public.roamer_posts using gin (tags);

alter table public.roamer_posts enable row level security;

drop policy if exists rp_read on public.roamer_posts;
create policy rp_read on public.roamer_posts
  for select using (
    is_hidden = false
    or user_id = auth.uid()
    or public.is_blog_admin()
  );

drop policy if exists rp_insert on public.roamer_posts;
create policy rp_insert on public.roamer_posts
  for insert with check (
    auth.uid() = user_id
    and length(trim(title)) between 2 and 140
    and length(coalesce(body, '')) <= 2000
    and coalesce(array_length(tags, 1), 0) <= 6
  );

-- Only admins may flip is_hidden. (Members edit nothing after posting.)
drop policy if exists rp_update on public.roamer_posts;
create policy rp_update on public.roamer_posts
  for update using (public.is_blog_admin()) with check (public.is_blog_admin());

drop policy if exists rp_delete on public.roamer_posts;
create policy rp_delete on public.roamer_posts
  for delete using (user_id = auth.uid() or public.is_blog_admin());

-- ---------------------------------------------------------------------
-- 2. LIKES  (one row per member per post)
-- ---------------------------------------------------------------------
create table if not exists public.roamer_post_likes (
  post_id    uuid not null references public.roamer_posts(id) on delete cascade,
  user_id    uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (post_id, user_id)
);

alter table public.roamer_post_likes enable row level security;

drop policy if exists rpl_read on public.roamer_post_likes;
create policy rpl_read on public.roamer_post_likes
  for select using (true);

drop policy if exists rpl_insert on public.roamer_post_likes;
create policy rpl_insert on public.roamer_post_likes
  for insert with check (auth.uid() = user_id);

drop policy if exists rpl_delete on public.roamer_post_likes;
create policy rpl_delete on public.roamer_post_likes
  for delete using (auth.uid() = user_id);

-- keep roamer_posts.like_count in step
create or replace function public.roamer_like_count_sync()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if (tg_op = 'INSERT') then
    update public.roamer_posts set like_count = like_count + 1 where id = new.post_id;
    return new;
  else
    update public.roamer_posts set like_count = greatest(like_count - 1, 0) where id = old.post_id;
    return old;
  end if;
end;
$$;

drop trigger if exists roamer_like_count_trg on public.roamer_post_likes;
create trigger roamer_like_count_trg
  after insert or delete on public.roamer_post_likes
  for each row execute function public.roamer_like_count_sync();

-- ---------------------------------------------------------------------
-- 3. REPLIES
-- ---------------------------------------------------------------------
create table if not exists public.roamer_post_replies (
  id         uuid primary key default gen_random_uuid(),
  post_id    uuid not null references public.roamer_posts(id) on delete cascade,
  user_id    uuid not null references auth.users(id) on delete cascade,
  body       text not null,
  is_hidden  boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists roamer_replies_post_idx
  on public.roamer_post_replies (post_id, created_at);

alter table public.roamer_post_replies enable row level security;

drop policy if exists rpr_read on public.roamer_post_replies;
create policy rpr_read on public.roamer_post_replies
  for select using (
    is_hidden = false
    or user_id = auth.uid()
    or public.is_blog_admin()
  );

drop policy if exists rpr_insert on public.roamer_post_replies;
create policy rpr_insert on public.roamer_post_replies
  for insert with check (
    auth.uid() = user_id
    and length(trim(body)) between 1 and 1000
  );

drop policy if exists rpr_update on public.roamer_post_replies;
create policy rpr_update on public.roamer_post_replies
  for update using (public.is_blog_admin()) with check (public.is_blog_admin());

drop policy if exists rpr_delete on public.roamer_post_replies;
create policy rpr_delete on public.roamer_post_replies
  for delete using (user_id = auth.uid() or public.is_blog_admin());

create or replace function public.roamer_reply_count_sync()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if (tg_op = 'INSERT') then
    update public.roamer_posts set reply_count = reply_count + 1 where id = new.post_id;
    return new;
  else
    update public.roamer_posts set reply_count = greatest(reply_count - 1, 0) where id = old.post_id;
    return old;
  end if;
end;
$$;

drop trigger if exists roamer_reply_count_trg on public.roamer_post_replies;
create trigger roamer_reply_count_trg
  after insert or delete on public.roamer_post_replies
  for each row execute function public.roamer_reply_count_sync();

-- ---------------------------------------------------------------------
-- 4. REPORTS  (members flag something; only admins can read them)
-- ---------------------------------------------------------------------
create table if not exists public.roamer_post_reports (
  id         uuid primary key default gen_random_uuid(),
  post_id    uuid references public.roamer_posts(id) on delete cascade,
  reply_id   uuid references public.roamer_post_replies(id) on delete cascade,
  user_id    uuid not null references auth.users(id) on delete cascade,
  reason     text,
  resolved   boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists roamer_reports_open_idx
  on public.roamer_post_reports (resolved, created_at desc);

alter table public.roamer_post_reports enable row level security;

-- Admins see every report. A member can see only the ones they filed
-- themselves (this is also what lets the browser read back the new
-- report's id so it can trigger the alert email).
drop policy if exists rprep_read on public.roamer_post_reports;
create policy rprep_read on public.roamer_post_reports
  for select using (public.is_blog_admin() or user_id = auth.uid());

drop policy if exists rprep_insert on public.roamer_post_reports;
create policy rprep_insert on public.roamer_post_reports
  for insert with check (
    auth.uid() = user_id
    and (post_id is not null or reply_id is not null)
    and length(coalesce(reason, '')) <= 500
  );

drop policy if exists rprep_update on public.roamer_post_reports;
create policy rprep_update on public.roamer_post_reports
  for update using (public.is_blog_admin()) with check (public.is_blog_admin());

drop policy if exists rprep_delete on public.roamer_post_reports;
create policy rprep_delete on public.roamer_post_reports
  for delete using (public.is_blog_admin());

-- ---------------------------------------------------------------------
-- 5. READ FUNCTIONS the city page calls
--    (security definer so signed-out visitors can read the board without
--     being handed direct access to the profiles table)
-- ---------------------------------------------------------------------

-- One page of posts for a city.
--   p_sort  'new'  = newest first (default)
--           'liked' = most liked first, newest breaking ties
--   p_tag   optional single hashtag filter (without the #)
drop function if exists public.city_connections(text, text, text, integer, integer);
create or replace function public.city_connections(
  city_name text,
  p_sort    text    default 'new',
  p_tag     text    default null,
  p_limit   integer default 20,
  p_offset  integer default 0
)
returns table (
  id           uuid,
  title        text,
  body         text,
  tags         text[],
  like_count   integer,
  reply_count  integer,
  created_at   timestamptz,
  author_id    uuid,
  author_name  text,
  avatar_url   text,
  author_public boolean,
  is_mine      boolean,
  liked_by_me  boolean
)
language sql
security definer
set search_path = public
stable
as $$
  select p.id,
         p.title,
         p.body,
         p.tags,
         p.like_count,
         p.reply_count,
         p.created_at,
         p.user_id,
         coalesce(nullif(trim(pr.display_name), ''), 'Roamer'),
         pr.avatar_url,
         coalesce(pr.is_public, false),
         (p.user_id = auth.uid()),
         exists (select 1 from public.roamer_post_likes l
                  where l.post_id = p.id and l.user_id = auth.uid())
    from public.roamer_posts p
    left join public.profiles pr on pr.id = p.user_id
   where lower(p.city) = lower(city_name)
     and p.is_hidden = false
     and (p_tag is null or lower(p_tag) = any (p.tags))
   order by
     case when p_sort = 'liked' then p.like_count end desc nulls last,
     p.created_at desc
   limit greatest(least(coalesce(p_limit, 20), 50), 1)
  offset greatest(coalesce(p_offset, 0), 0)
$$;

grant execute on function public.city_connections(text, text, text, integer, integer)
  to anon, authenticated;

-- Every reply on one post, oldest first.
drop function if exists public.city_connection_replies(uuid);
create or replace function public.city_connection_replies(p_post_id uuid)
returns table (
  id            uuid,
  body          text,
  created_at    timestamptz,
  author_id     uuid,
  author_name   text,
  avatar_url    text,
  author_public boolean,
  is_mine       boolean
)
language sql
security definer
set search_path = public
stable
as $$
  select r.id,
         r.body,
         r.created_at,
         r.user_id,
         coalesce(nullif(trim(pr.display_name), ''), 'Roamer'),
         pr.avatar_url,
         coalesce(pr.is_public, false),
         (r.user_id = auth.uid())
    from public.roamer_post_replies r
    left join public.profiles pr on pr.id = r.user_id
   where r.post_id = p_post_id
     and r.is_hidden = false
   order by r.created_at
   limit 200
$$;

grant execute on function public.city_connection_replies(uuid) to anon, authenticated;

-- The hashtags actually in use in a city, most used first (for the chips).
drop function if exists public.city_connection_tags(text);
create or replace function public.city_connection_tags(city_name text)
returns table (tag text, uses bigint)
language sql
security definer
set search_path = public
stable
as $$
  select t.tag, count(*) as uses
    from public.roamer_posts p, unnest(p.tags) as t(tag)
   where lower(p.city) = lower(city_name)
     and p.is_hidden = false
   group by t.tag
   order by uses desc, t.tag
   limit 12
$$;

grant execute on function public.city_connection_tags(text) to anon, authenticated;

-- ---------------------------------------------------------------------
-- 6. MODERATION — admin.html → Connections tab
-- ---------------------------------------------------------------------
drop function if exists public.admin_connection_reports(boolean);
create or replace function public.admin_connection_reports(p_include_resolved boolean default false)
returns table (
  report_id     uuid,
  reported_at   timestamptz,
  reason        text,
  resolved      boolean,
  kind          text,          -- 'post' or 'reply'
  target_id     uuid,
  post_id       uuid,
  city          text,
  title         text,
  content       text,
  is_hidden     boolean,
  author_id     uuid,
  author_name   text,
  reporter_name text
)
language sql
security definer
set search_path = public
stable
as $$
  select rep.id,
         rep.created_at,
         rep.reason,
         rep.resolved,
         case when rep.reply_id is null then 'post' else 'reply' end,
         coalesce(rep.reply_id, rep.post_id),
         coalesce(rep.post_id, r.post_id),
         coalesce(p.city, p2.city),
         coalesce(p.title, p2.title),
         coalesce(r.body, p.body),
         coalesce(r.is_hidden, p.is_hidden),
         coalesce(r.user_id, p.user_id),
         coalesce(nullif(trim(auth_pr.display_name), ''), 'Roamer'),
         coalesce(nullif(trim(rep_pr.display_name), ''), 'Roamer')
    from public.roamer_post_reports rep
    left join public.roamer_posts        p  on p.id  = rep.post_id
    left join public.roamer_post_replies r  on r.id  = rep.reply_id
    left join public.roamer_posts        p2 on p2.id = r.post_id
    left join public.profiles auth_pr on auth_pr.id = coalesce(r.user_id, p.user_id)
    left join public.profiles rep_pr  on rep_pr.id  = rep.user_id
   where public.is_blog_admin()
     and (p_include_resolved or rep.resolved = false)
   order by rep.created_at desc
   limit 200
$$;

grant execute on function public.admin_connection_reports(boolean) to authenticated;

-- Hide / unhide a post or reply (admins only).
drop function if exists public.admin_connection_set_hidden(text, uuid, boolean);
create or replace function public.admin_connection_set_hidden(
  p_kind   text,
  p_id     uuid,
  p_hidden boolean
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_blog_admin() then
    raise exception 'not allowed';
  end if;
  if p_kind = 'reply' then
    update public.roamer_post_replies set is_hidden = p_hidden where id = p_id;
  else
    update public.roamer_posts set is_hidden = p_hidden where id = p_id;
  end if;
end;
$$;

grant execute on function public.admin_connection_set_hidden(text, uuid, boolean) to authenticated;
