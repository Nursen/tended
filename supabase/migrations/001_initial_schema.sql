-- Tended initial schema
-- All tables use RLS so users can only access their own data

-- ─────────────────────────────────────────────────────────────
-- PROFILES
-- ─────────────────────────────────────────────────────────────

create table profiles (
  id uuid primary key references auth.users on delete cascade,
  display_name text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table profiles enable row level security;

create policy "Users can view own profile"
  on profiles for select using (auth.uid() = id);
create policy "Users can insert own profile"
  on profiles for insert with check (auth.uid() = id);
create policy "Users can update own profile"
  on profiles for update using (auth.uid() = id);
create policy "Users can delete own profile"
  on profiles for delete using (auth.uid() = id);

-- Auto-create a profile row when a new user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)));
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ─────────────────────────────────────────────────────────────
-- GARDENS
-- ─────────────────────────────────────────────────────────────

create table gardens (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  name text not null,
  description text,
  icon text not null default '🏠',
  is_demo boolean default false,
  created_at timestamptz default now()
);

alter table gardens enable row level security;

create policy "Users can view own gardens"
  on gardens for select using (auth.uid() = user_id);
create policy "Users can insert own gardens"
  on gardens for insert with check (auth.uid() = user_id);
create policy "Users can update own gardens"
  on gardens for update using (auth.uid() = user_id);
create policy "Users can delete own gardens"
  on gardens for delete using (auth.uid() = user_id);

-- ─────────────────────────────────────────────────────────────
-- FRIENDS
-- ─────────────────────────────────────────────────────────────

create table friends (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  garden_id uuid not null references gardens(id) on delete cascade,
  name text not null,
  photo text,
  tier int not null check (tier between 1 and 5),
  roles text[] default '{}',
  location_city text,
  location_region text,
  birthday date,
  important_dates jsonb default '[]',
  profile_data jsonb default '{}',
  tier_history jsonb[] default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table friends enable row level security;

create policy "Users can view own friends"
  on friends for select using (auth.uid() = user_id);
create policy "Users can insert own friends"
  on friends for insert with check (auth.uid() = user_id);
create policy "Users can update own friends"
  on friends for update using (auth.uid() = user_id);
create policy "Users can delete own friends"
  on friends for delete using (auth.uid() = user_id);

-- ─────────────────────────────────────────────────────────────
-- INTERACTIONS
-- ─────────────────────────────────────────────────────────────

create table interactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  friend_id uuid not null references friends(id) on delete cascade,
  type text not null,
  date timestamptz not null default now(),
  note text,
  initiated_by text,
  created_at timestamptz default now()
);

alter table interactions enable row level security;

create policy "Users can view own interactions"
  on interactions for select using (auth.uid() = user_id);
create policy "Users can insert own interactions"
  on interactions for insert with check (auth.uid() = user_id);
create policy "Users can update own interactions"
  on interactions for update using (auth.uid() = user_id);
create policy "Users can delete own interactions"
  on interactions for delete using (auth.uid() = user_id);

-- ─────────────────────────────────────────────────────────────
-- PLANT APPEARANCES
-- ─────────────────────────────────────────────────────────────

create table plant_appearances (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  friend_id uuid not null references friends(id) on delete cascade,
  plant_type text not null,
  pot_style text not null,
  pot_color text not null,
  constraint unique_friend_appearance unique (friend_id)
);

alter table plant_appearances enable row level security;

create policy "Users can view own plant appearances"
  on plant_appearances for select using (auth.uid() = user_id);
create policy "Users can insert own plant appearances"
  on plant_appearances for insert with check (auth.uid() = user_id);
create policy "Users can update own plant appearances"
  on plant_appearances for update using (auth.uid() = user_id);
create policy "Users can delete own plant appearances"
  on plant_appearances for delete using (auth.uid() = user_id);

-- ─────────────────────────────────────────────────────────────
-- INDEXES
-- ─────────────────────────────────────────────────────────────

create index idx_gardens_user_id on gardens(user_id);
create index idx_friends_user_id on friends(user_id);
create index idx_friends_garden_id on friends(garden_id);
create index idx_interactions_user_id on interactions(user_id);
create index idx_interactions_friend_id on interactions(friend_id);
create index idx_plant_appearances_user_id on plant_appearances(user_id);
create index idx_plant_appearances_friend_id on plant_appearances(friend_id);
