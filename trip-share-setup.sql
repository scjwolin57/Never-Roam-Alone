-- =====================================================================
-- TRIP-SHARE-SETUP.SQL — one-time setup for shareable trip links.
-- Powers trip.html: a read-only trip page anyone can open WITHOUT an
-- account, using a long secret code in the link (nobody can guess it,
-- and trips without a code — or people without the link — see nothing).
--
-- In Supabase: SQL Editor → New query → paste ALL of this → Run.
-- Safe to re-run.
-- =====================================================================

-- The secret code lives on the trip itself. It's only created the first
-- time the owner taps Share, so unshared trips have no code at all.
alter table public.itineraries
  add column if not exists share_code text unique
  check (share_code is null or char_length(share_code) between 16 and 64);

-- One safe "door" for visitors: given a valid code, return that ONE
-- trip's name, owner's first name, and its stops — nothing else.
-- (security definer = the function may read the tables, but callers can
-- only get what this function chooses to hand back for an exact code.)
create or replace function public.get_shared_trip(code text)
returns json
language sql
security definer
stable
set search_path = public
as $$
  select json_build_object(
    'name',  i.name,
    'owner', coalesce(nullif(trim(pr.display_name), ''), 'A Roamer'),
    'stops', coalesce((
      select json_agg(json_build_object(
               'place',   ip.place,
               'country', ip.country,
               'arrive',  ip.arrive,
               'depart',  ip.depart)
             order by ip.sort_order, ip.created_at)
      from public.itinerary_places ip
      where ip.itinerary_id = i.id
    ), '[]'::json)
  )
  from public.itineraries i
  left join public.profiles pr on pr.id = i.user_id
  where i.share_code = code
    and char_length(code) >= 16
  limit 1;
$$;

-- Anyone (signed in or not) may ASK with a code; without a valid code
-- the answer is simply empty.
grant execute on function public.get_shared_trip(text) to anon, authenticated;
