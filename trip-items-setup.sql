-- =====================================================================
-- TRIP-ITEMS-SETUP.SQL — one-time setup for saving landmarks, day trips
-- and recommended places (eat / coffee / drink / stay picks) to a trip.
-- Powers the "+ Add to trip" button on those cards on city.html, the
-- items shown under each stop on itinerary.html, and the shared trip
-- page (trip.html).
--
-- Run AFTER named-itineraries-setup.sql and trip-share-setup.sql.
-- In Supabase: SQL Editor → New query → paste ALL of this → Run.
-- Safe to re-run.
-- =====================================================================

-- One row per thing saved to a trip. It hangs off the trip and the city
-- (by name, the same "place" string itinerary_places uses), so it shows
-- under that city's stop. Deleting the trip removes its items.
create table if not exists public.trip_items (
  id uuid primary key default gen_random_uuid(),
  itinerary_id uuid not null references public.itineraries(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  city text not null check (char_length(city) <= 80),
  country text not null default '' check (char_length(country) <= 60),
  kind text not null check (kind in ('landmark','daytrip','place')),
  name text not null check (char_length(name) <= 160),
  -- place: eat | cafes | bars | stay ; daytrip: half | full ; landmark: ''
  section text not null default '' check (char_length(section) <= 20),
  hood text not null default '' check (char_length(hood) <= 80),
  note text not null default '' check (char_length(note) <= 400),
  map_url text not null default '' check (char_length(map_url) <= 600),
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  -- the same thing can't be saved twice to the same trip
  unique (itinerary_id, kind, city, name)
);

create index if not exists trip_items_itin_idx on public.trip_items (itinerary_id);

alter table public.trip_items enable row level security;

-- Data API access (Supabase stops auto-granting on 2026-10-30). Mirrors the policies.
grant select, insert, update, delete on public.trip_items to authenticated;
grant all on public.trip_items to service_role;

drop policy if exists "read own trip items" on public.trip_items;
create policy "read own trip items"   on public.trip_items for select using (auth.uid() = user_id);

drop policy if exists "add own trip items" on public.trip_items;
create policy "add own trip items"    on public.trip_items for insert with check (auth.uid() = user_id);

drop policy if exists "update own trip items" on public.trip_items;
create policy "update own trip items" on public.trip_items for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "delete own trip items" on public.trip_items;
create policy "delete own trip items" on public.trip_items for delete using (auth.uid() = user_id);

-- The shared-trip "door" (trip-share-setup.sql) now hands back each stop's
-- saved items too, so trip.html can list them under the stop.
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
               'depart',  ip.depart,
               'items',   coalesce((
                 select json_agg(json_build_object(
                          'kind', ti.kind, 'name', ti.name, 'section', ti.section,
                          'hood', ti.hood, 'note', ti.note, 'map_url', ti.map_url)
                        order by ti.kind, ti.sort_order, ti.created_at)
                 from public.trip_items ti
                 where ti.itinerary_id = i.id
                   and lower(ti.city) = lower(ip.place)
               ), '[]'::json))
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

grant execute on function public.get_shared_trip(text) to anon, authenticated;
