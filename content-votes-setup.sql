-- =====================================================================
-- CONTENT-VOTES-SETUP.SQL — one-time setup for the site-wide thumbs
-- up/down reaction feature on city.html (visitors box, stay cards, gym
-- and laundromat listings, food places, hood/landmark/day-trip/event
-- recommendations, neighborhood photos, the cost estimator, safety
-- notes, insights and blog articles).
--
-- One control per item: a signed-in visitor casts up OR down, never
-- both, and can change their mind (update, not a second row) — the
-- unique constraint below enforces one vote per user per item.
--
-- In Supabase: SQL Editor -> New query -> paste ALL of this -> Run.
-- Safe to re-run (idempotent).
-- =====================================================================

-- ---------- 1. The votes table ----------
create table if not exists public.content_votes (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  target_type   text not null check (target_type in (
    'visitors','stay_card','gym','laundromat','food_place','recommendation',
    'hood_photo','landmark','cost_estimator','safety_note','daytrip',
    'event','insight','blog_article'
  )),
  target_id     text not null,   -- stable key for the exact item (city slug + hood index + kind, landmark index, place id, etc.)
  city          text,            -- denormalized, for per-city aggregate queries
  value         smallint not null check (value in (-1, 1)),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  unique (user_id, target_type, target_id)
);

create index if not exists content_votes_target_idx
  on public.content_votes (target_type, target_id);

alter table public.content_votes enable row level security;

create or replace function public.content_votes_touch()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
drop trigger if exists content_votes_touch on public.content_votes;
create trigger content_votes_touch before update on public.content_votes
  for each row execute function public.content_votes_touch();

-- A signed-in visitor manages only their own vote. No moderation needed
-- here (unlike insights/photos/events): the unique constraint is the
-- whole of the spam guard, so this can insert/update directly from the
-- client, unlike the pending-review tables.
drop policy if exists "own votes select" on public.content_votes;
create policy "own votes select" on public.content_votes
  for select using (auth.uid() = user_id);

drop policy if exists "own votes insert" on public.content_votes;
create policy "own votes insert" on public.content_votes
  for insert with check (auth.uid() = user_id);

drop policy if exists "own votes update" on public.content_votes;
create policy "own votes update" on public.content_votes
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "own votes delete" on public.content_votes;
create policy "own votes delete" on public.content_votes
  for delete using (auth.uid() = user_id);

-- ---------- 2. Public aggregate view: counts only, no user_id ----------
create or replace view public.content_vote_counts as
  select target_type, target_id,
    count(*) filter (where value =  1) as up,
    count(*) filter (where value = -1) as down
  from public.content_votes
  group by target_type, target_id;

grant select on public.content_vote_counts to anon, authenticated;
