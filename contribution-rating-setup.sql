-- =====================================================================
-- CONTRIBUTION-RATING-SETUP.SQL — one-time setup for the Contribution
-- score, its levels, and the Trusted Traveler Rating on Roamer profiles
-- (Jeff, 2026-10-02; decisions.md and
-- _needs-attention/contribution-rating-2026-10-02.md).
--
-- Builds on contribution-points-setup.sql (the points ledger and
-- profiles.contribution_points), which must already have been run.
--
--   1. city_insights.user_id and city_events.submitted_by: the signed-in
--      member who sent an interview or an event, so approving it can
--      credit them. Filled by submit-interview.js / submit-event.js from
--      the member's session, never from a typed email.
--   2. A new points kind, 'blog_post' (25 points), awarded by a trigger
--      when a blog post with an author is published.
--   3. contribution_targets: which approved item (by its vote key) belongs
--      to which member, so votes on that item count toward their rating.
--      Written server-side only (approve functions, the blog trigger).
--   4. roamer_contribution_stats: a public view of each PUBLIC profile's
--      points and the thumbs up / down its contributions received. No
--      email or private field. The level, the badge and the rating
--      percentage are worked out on the page (contrib-score.js) from these
--      three numbers, so the thresholds live in one file.
--
-- In Supabase: SQL Editor -> New query -> paste ALL of this -> Run.
-- Safe to re-run (idempotent).
-- =====================================================================

-- ---------- 1. Who sent it ----------
alter table public.city_insights add column if not exists user_id uuid references auth.users(id) on delete set null;
alter table public.city_events   add column if not exists submitted_by uuid references auth.users(id) on delete set null;

-- ---------- 2. Blog posts earn points ----------
alter table public.contribution_events drop constraint if exists contribution_events_kind_check;
alter table public.contribution_events add constraint contribution_events_kind_check check (kind in (
  'insight', 'photo', 'recommendation', 'daytrip_landmark', 'event', 'correction', 'blog_post'
));

-- ---------- 3. Which approved item belongs to whom ----------
create table if not exists public.contribution_targets (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  target_type   text not null,   -- same values as content_votes.target_type
  target_id     text not null,   -- same key the vote widget uses for that item
  source_table  text,
  source_id     uuid,
  city          text,
  created_at    timestamptz not null default now(),
  unique (target_type, target_id)
);
create index if not exists contribution_targets_user_idx on public.contribution_targets (user_id);
alter table public.contribution_targets enable row level security;
-- No client policies: only the service key (approve functions) and the
-- security-definer trigger below write here. Admins can read it.
drop policy if exists "admins read contribution targets" on public.contribution_targets;
create policy "admins read contribution targets" on public.contribution_targets
  for select using (public.is_blog_admin());

-- Blog post published with an author -> 25 points and its vote key, once.
create or replace function public.blog_post_contribution()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.published and new.author_id is not null then
    if not exists (select 1 from public.contribution_events
                    where source_table = 'blog_posts' and source_id = new.id) then
      insert into public.contribution_events (user_id, kind, points, source_table, source_id, city)
      values (new.author_id, 'blog_post', 25, 'blog_posts', new.id, new.location);
    end if;
    insert into public.contribution_targets (user_id, target_type, target_id, source_table, source_id, city)
    values (new.author_id, 'blog_article', new.slug, 'blog_posts', new.id, new.location)
    on conflict (target_type, target_id) do nothing;
  end if;
  return new;
end;
$$;
drop trigger if exists blog_post_contribution on public.blog_posts;
create trigger blog_post_contribution after insert or update of published, author_id on public.blog_posts
  for each row execute function public.blog_post_contribution();

-- ---------- 4. The public numbers ----------
create or replace view public.roamer_contribution_stats as
  select p.id,
         p.contribution_points as points,
         coalesce(v.up, 0)     as votes_up,
         coalesce(v.down, 0)   as votes_down
    from public.profiles p
    left join (
      select t.user_id, sum(c.up)::int as up, sum(c.down)::int as down
        from public.contribution_targets t
        join public.content_vote_counts c
          on c.target_type = t.target_type and c.target_id = t.target_id
       group by t.user_id
    ) v on v.user_id = p.id
   where p.is_public = true;

grant select on public.roamer_contribution_stats to anon, authenticated;

-- The owner's own numbers, even while their profile is private
-- (profile.html shows them their score before they go public).
create or replace function public.my_contribution_stats()
returns table (points int, votes_up int, votes_down int)
language sql stable security definer set search_path = public as $$
  select p.contribution_points,
         coalesce((select sum(c.up)::int   from public.contribution_targets t join public.content_vote_counts c
                    on c.target_type = t.target_type and c.target_id = t.target_id where t.user_id = p.id), 0),
         coalesce((select sum(c.down)::int from public.contribution_targets t join public.content_vote_counts c
                    on c.target_type = t.target_type and c.target_id = t.target_id where t.user_id = p.id), 0)
    from public.profiles p
   where p.id = auth.uid();
$$;
grant execute on function public.my_contribution_stats() to authenticated;
