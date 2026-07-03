-- =====================================================================
-- SUPABASE-SETUP.SQL — one-time database setup for Never Roam Alone.
-- In Supabase: SQL Editor → New query → paste ALL of this → Run.
-- Safe to run once; it creates the profile/forum tables and the rules
-- that control who can read or change what.
-- =====================================================================

-- ---- Profiles: one row per signed-up user --------------------------
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  display_name text,
  notify_replies boolean not null default true,
  created_at timestamptz not null default now()
);
alter table public.profiles enable row level security;
create policy "read own profile"   on public.profiles for select using (auth.uid() = id);
create policy "update own profile" on public.profiles for update using (auth.uid() = id);

-- Auto-create a profile whenever someone signs up (any method)
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, display_name)
  values (new.id, new.email,
          coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email,'@',1)));
  return new;
end; $$;
create trigger on_auth_user_created after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ---- Forum: questions & replies, visible to everyone ---------------
create table public.questions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  name text not null default 'Anonymous Roamer',
  city text not null default 'General Travel',
  title text not null check (char_length(title) <= 140),
  body text not null default '' check (char_length(body) <= 1200),
  likes int not null default 0,
  dislikes int not null default 0,
  created_at timestamptz not null default now()
);
create table public.replies (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references public.questions(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  name text not null default 'Anonymous Roamer',
  body text not null check (char_length(body) <= 800),
  likes int not null default 0,
  dislikes int not null default 0,
  created_at timestamptz not null default now()
);
alter table public.questions enable row level security;
alter table public.replies  enable row level security;
-- Everyone (signed in or not) can read and post — login stays optional.
create policy "questions are public" on public.questions for select using (true);
create policy "anyone can ask"       on public.questions for insert with check (true);
create policy "replies are public"   on public.replies  for select using (true);
create policy "anyone can reply"     on public.replies  for insert with check (true);

-- ---- Voting: a controlled counter update (max ±1 per click) --------
create or replace function public.adjust_votes(kind text, row_id uuid, d_likes int, d_dislikes int)
returns table(likes int, dislikes int)
language plpgsql security definer set search_path = public as $$
begin
  if abs(d_likes) > 1 or abs(d_dislikes) > 1 then
    raise exception 'vote change too large';
  end if;
  if kind = 'question' then
    update public.questions q
       set likes = greatest(0, q.likes + d_likes),
           dislikes = greatest(0, q.dislikes + d_dislikes)
     where q.id = row_id;
    return query select q.likes, q.dislikes from public.questions q where q.id = row_id;
  else
    update public.replies r
       set likes = greatest(0, r.likes + d_likes),
           dislikes = greatest(0, r.dislikes + d_dislikes)
     where r.id = row_id;
    return query select r.likes, r.dislikes from public.replies r where r.id = row_id;
  end if;
end; $$;
grant execute on function public.adjust_votes to anon, authenticated;
