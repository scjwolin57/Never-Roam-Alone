-- =====================================================================
-- MESSAGES-SETUP.SQL — one-time setup for private Roamer-to-Roamer
-- messages.
--
-- What this does, in plain English:
--   1. Adds two switches to every profile, both ON to start:
--      • "let other Roamers message me" — flip it OFF on your profile
--        page and new messages to you stop instantly.
--      • "email me about new messages" — controls only the alert
--        emails, not the messages themselves.
--   2. Creates the mailbox (a "messages" table). The rules on it mean
--      each person can only ever read conversations THEY are part of.
--   3. Creates a block list. If you block someone, nothing they try
--      to send you goes through — and they aren't told they're
--      blocked (it looks the same as messages being switched off).
--   4. Refreshes the safe public "window" so profile pages know
--      whether to show the Message button. (Also fixes an earlier
--      miss: the "Trip durations" chip wasn't in the window, so it
--      never showed to visitors.)
--
-- HOW TO RUN: Supabase → SQL Editor → New query → paste ALL of this →
-- Run. Safe to run more than once.
-- =====================================================================

-- 1. The switches (both ON by default for everyone)
alter table public.profiles
  add column if not exists allow_messages       boolean not null default true,
  add column if not exists allow_message_emails boolean not null default true;

-- 2. The mailbox. Names are saved on each message so conversations
--    still show who's who even if someone later makes their profile
--    private.
create table if not exists public.messages (
  id             uuid primary key default gen_random_uuid(),
  sender_id      uuid not null references auth.users(id) on delete cascade,
  recipient_id   uuid not null references auth.users(id) on delete cascade,
  sender_name    text,
  recipient_name text,
  body           text not null check (char_length(body) between 1 and 2000),
  created_at     timestamptz not null default now(),
  read_at        timestamptz
);
create index if not exists messages_sender_idx    on public.messages (sender_id,    created_at desc);
create index if not exists messages_recipient_idx on public.messages (recipient_id, created_at desc);

-- 3. The block list. Only you can see or change who YOU have blocked.
create table if not exists public.message_blocks (
  blocker_id uuid not null references auth.users(id) on delete cascade,
  blocked_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (blocker_id, blocked_id)
);

-- A small helper the send-rule uses. It runs with admin eyes
-- (security definer) so it can check the OTHER person's switch and
-- block list — things the sender is never allowed to read directly.
create or replace function public.can_message(recipient uuid)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
           select 1 from public.profiles p
            where p.id = recipient
              and coalesce(p.allow_messages, true)
         )
     and not exists (
           select 1 from public.message_blocks b
            where b.blocker_id = recipient
              and b.blocked_id = auth.uid()
         );
$$;

-- ---- The rules (row-level security) ----
alter table public.messages enable row level security;

drop policy if exists "read own conversations" on public.messages;
create policy "read own conversations" on public.messages
  for select to authenticated
  using (auth.uid() = sender_id or auth.uid() = recipient_id);

drop policy if exists "send messages" on public.messages;
create policy "send messages" on public.messages
  for insert to authenticated
  with check (auth.uid() = sender_id
              and recipient_id <> auth.uid()
              and public.can_message(recipient_id));

-- Recipients may update a message — but the grant below limits that
-- update to the read_at column only (marking it as read). Nobody can
-- ever edit a message's text after it's sent.
drop policy if exists "mark received messages read" on public.messages;
create policy "mark received messages read" on public.messages
  for update to authenticated
  using (auth.uid() = recipient_id)
  with check (auth.uid() = recipient_id);

revoke all on public.messages from anon, authenticated;
grant select, insert on public.messages to authenticated;
grant update (read_at) on public.messages to authenticated;

alter table public.message_blocks enable row level security;

drop policy if exists "manage own block list" on public.message_blocks;
create policy "manage own block list" on public.message_blocks
  for all to authenticated
  using (auth.uid() = blocker_id)
  with check (auth.uid() = blocker_id);

revoke all on public.message_blocks from anon, authenticated;
grant select, insert, delete on public.message_blocks to authenticated;

-- 4. Refresh the public window: adds allow_messages (so profile pages
--    know whether to show the Message button) and trip_duration
--    (previously missing, so the chip never showed to visitors).
--    Rebuilding from scratch is harmless — a view stores no data.
drop view if exists public.public_profiles;
create view public.public_profiles as
  select id,
         display_name,
         bio,
         home_city,
         home_country,
         travel_style,
         travel_company,
         website,
         instagram,
         avatar_url,
         cover_url,
         created_at,
         age,
         fav_destination,
         no_return_destination,
         bucket_list_destination,
         best_story,
         scary_story,
         extra_details,
         facebook,
         twitter,
         tiktok,
         youtube,
         travel_photos,
         avatar_caption,
         last_trip,
         next_trip,
         travel_goals,
         trip_duration,
         allow_messages
    from public.profiles
   where is_public = true;

grant select on public.public_profiles to anon, authenticated;
