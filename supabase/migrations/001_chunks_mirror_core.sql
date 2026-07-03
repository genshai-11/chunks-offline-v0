-- CHUNKS Mirror / Offline Live Room core compatibility baseline
-- Created: 2026-07-03
--
-- This migration is intentionally idempotent. The linked Supabase project already
-- contains the CHUNKS content/live-room schema, so this file documents and
-- backfills the expected local/preview schema without dropping or rewriting data.

create extension if not exists pgcrypto;

create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  status text not null default 'active' check (status in ('draft', 'active', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.lessons (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  title text not null,
  order_index integer not null default 1,
  status text not null default 'active' check (status in ('draft', 'active', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.lesson_sections (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  title text not null,
  order_index integer not null default 1,
  status text not null default 'active' check (status in ('draft', 'active', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.cci_categories (
  id text primary key,
  label text not null,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.cci_standard_cards (
  id uuid primary key default gen_random_uuid(),
  category_id text not null references public.cci_categories(id),
  label text not null,
  standard_value numeric not null check (standard_value >= 0),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.cvr_units (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  unit_symbol text not null default 'Ω',
  value numeric not null check (value >= 0),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.sentence_resources (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id),
  lesson_id uuid not null references public.lessons(id),
  section_id uuid references public.lesson_sections(id),
  sentence_code text not null,
  text_prompt text,
  text_en text,
  text_vi text,
  audio_url text,
  audio_en_url text,
  audio_vi_url text,
  audio_variants jsonb not null default '{}'::jsonb,
  default_cvr_unit_id uuid references public.cvr_units(id),
  default_cvr_value numeric not null default 1 check (default_cvr_value >= 0),
  cvr_value numeric not null default 1 check (cvr_value >= 0),
  order_index integer not null default 1,
  approval_status text not null default 'approved' check (approval_status in ('draft', 'approved', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.learners (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique,
  display_name text not null,
  source text not null default 'anonymous' check (source in ('manual', 'imported', 'anonymous')),
  last_seen_at timestamptz default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.practice_rooms (
  id uuid primary key default gen_random_uuid(),
  room_code text not null unique,
  title text not null,
  status text not null default 'lobby' check (status in ('lobby', 'round_open', 'round_closed', 'finished')),
  current_round_id uuid,
  course_id uuid references public.courses(id),
  lesson_id uuid references public.lessons(id),
  host_name text,
  resource_scope_filter jsonb not null default '{}'::jsonb,
  snapshot_sentence_resource_ids uuid[] not null default '{}'::uuid[],
  scope_refreshed_at timestamptz,
  scoring_mode text not null default 'simple' check (scoring_mode in ('simple', 'timed')),
  default_response_capture_mode text not null default 'assigned' check (default_response_capture_mode in ('assigned', 'first_responder', 'auto_rotate')),
  teacher_pin_hash text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.room_memberships (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.practice_rooms(id) on delete cascade,
  learner_id uuid not null references public.learners(id) on delete cascade,
  presence_status text not null default 'online' check (presence_status in ('online', 'offline', 'left')),
  can_answer boolean not null default false,
  joined_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (room_id, learner_id)
);

create table if not exists public.room_rounds (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.practice_rooms(id) on delete cascade,
  sentence_resource_id uuid not null references public.sentence_resources(id),
  assigned_learner_id uuid references public.learners(id),
  captured_learner_id uuid references public.learners(id),
  cci_standard_card_id uuid references public.cci_standard_cards(id),
  cci_standard_x numeric not null default 0 check (cci_standard_x >= 0),
  cvr_value numeric not null default 1 check (cvr_value >= 0),
  round_index integer not null default 1,
  status text not null default 'draft' check (status in ('draft', 'open', 'closed')),
  response_capture_mode_snapshot text not null default 'assigned' check (response_capture_mode_snapshot in ('assigned', 'first_responder', 'auto_rotate')),
  scoring_mode_snapshot text not null default 'simple' check (scoring_mode_snapshot in ('simple', 'timed')),
  opened_by text,
  sequence_key text,
  opened_at timestamptz,
  closed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'practice_rooms_current_round_fk'
      and conrelid = 'public.practice_rooms'::regclass
  ) then
    alter table public.practice_rooms
      add constraint practice_rooms_current_round_fk
      foreign key (current_round_id) references public.room_rounds(id) deferrable initially deferred;
  end if;
end $$;

create table if not exists public.learner_responses (
  id uuid primary key default gen_random_uuid(),
  round_id uuid not null references public.room_rounds(id) on delete cascade,
  learner_id uuid not null references public.learners(id),
  response_color text not null check (response_color in ('red', 'yellow', 'green')),
  performance_y integer not null check (performance_y in (0, 1, 2)),
  reflection_time_ms integer not null default 0,
  reflection_seconds numeric not null default 0,
  cci_standard_x numeric not null default 0,
  cvr_value numeric not null default 1,
  cci_result numeric not null default 0,
  cpd_result numeric not null default 0,
  finalized boolean not null default false,
  scoring_mode_snapshot text not null default 'simple' check (scoring_mode_snapshot in ('simple', 'timed')),
  response_capture_mode_snapshot text not null default 'assigned' check (response_capture_mode_snapshot in ('assigned', 'first_responder', 'auto_rotate')),
  submitted_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (round_id)
);

create table if not exists public.learner_progress (
  id uuid primary key default gen_random_uuid(),
  learner_id uuid not null references public.learners(id) on delete cascade,
  course_id uuid references public.courses(id),
  lesson_id uuid references public.lessons(id),
  total_cpd numeric not null default 0,
  finalized_rounds integer not null default 0,
  updated_at timestamptz not null default now(),
  unique (learner_id, course_id, lesson_id)
);

-- Compatibility backfills for linked remote schema variants.
alter table public.sentence_resources add column if not exists text_en text;
alter table public.sentence_resources add column if not exists text_vi text;
alter table public.sentence_resources add column if not exists audio_en_url text;
alter table public.sentence_resources add column if not exists audio_vi_url text;
alter table public.sentence_resources add column if not exists cvr_value numeric not null default 1 check (cvr_value >= 0);
alter table public.learner_responses add column if not exists reflection_time_ms integer not null default 0;
alter table public.learner_responses add column if not exists reflection_seconds numeric not null default 0;
alter table public.learner_responses add column if not exists cci_result numeric not null default 0;
alter table public.learner_responses add column if not exists scoring_mode_snapshot text not null default 'simple';
alter table public.learner_responses add column if not exists response_capture_mode_snapshot text not null default 'assigned';

create index if not exists idx_sentence_resources_scope on public.sentence_resources(course_id, lesson_id, section_id, approval_status, order_index);
create index if not exists idx_practice_rooms_room_code on public.practice_rooms(room_code);
create index if not exists idx_room_memberships_room on public.room_memberships(room_id);
create index if not exists idx_room_rounds_room_status on public.room_rounds(room_id, status, round_index);
create index if not exists idx_learner_responses_round on public.learner_responses(round_id);
create index if not exists idx_learner_responses_learner on public.learner_responses(learner_id);

alter table public.courses enable row level security;
alter table public.lessons enable row level security;
alter table public.lesson_sections enable row level security;
alter table public.cci_categories enable row level security;
alter table public.cci_standard_cards enable row level security;
alter table public.cvr_units enable row level security;
alter table public.sentence_resources enable row level security;
alter table public.learners enable row level security;
alter table public.practice_rooms enable row level security;
alter table public.room_memberships enable row level security;
alter table public.room_rounds enable row level security;
alter table public.learner_responses enable row level security;
alter table public.learner_progress enable row level security;

-- MVP permissive read policies for approved learning content and active room state.
-- T060 will harden role-aware RLS before production release.
do $$
begin
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'courses' and policyname = 'read active courses') then
    create policy "read active courses" on public.courses for select using (status = 'active');
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'lessons' and policyname = 'read active lessons') then
    create policy "read active lessons" on public.lessons for select using (status = 'active');
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'lesson_sections' and policyname = 'read active sections') then
    create policy "read active sections" on public.lesson_sections for select using (status = 'active');
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'sentence_resources' and policyname = 'read approved sentence resources') then
    create policy "read approved sentence resources" on public.sentence_resources for select using (approval_status = 'approved');
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'cci_categories' and policyname = 'read active cci categories') then
    create policy "read active cci categories" on public.cci_categories for select using (active = true);
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'cci_standard_cards' and policyname = 'read active cci cards') then
    create policy "read active cci cards" on public.cci_standard_cards for select using (active = true);
  end if;

  -- MVP live-room policies. These are intentionally permissive for local/preview
  -- classroom validation; T060 must replace them with role-aware production RLS.
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'practice_rooms' and policyname = 'mvp read rooms') then
    create policy "mvp read rooms" on public.practice_rooms for select using (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'practice_rooms' and policyname = 'mvp write rooms') then
    create policy "mvp write rooms" on public.practice_rooms for all using (true) with check (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'room_memberships' and policyname = 'mvp read memberships') then
    create policy "mvp read memberships" on public.room_memberships for select using (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'room_memberships' and policyname = 'mvp write memberships') then
    create policy "mvp write memberships" on public.room_memberships for all using (true) with check (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'room_rounds' and policyname = 'mvp read rounds') then
    create policy "mvp read rounds" on public.room_rounds for select using (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'room_rounds' and policyname = 'mvp write rounds') then
    create policy "mvp write rounds" on public.room_rounds for all using (true) with check (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'learner_responses' and policyname = 'mvp read responses') then
    create policy "mvp read responses" on public.learner_responses for select using (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'learner_responses' and policyname = 'mvp write responses') then
    create policy "mvp write responses" on public.learner_responses for all using (true) with check (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'learner_progress' and policyname = 'mvp read learner progress') then
    create policy "mvp read learner progress" on public.learner_progress for select using (true);
  end if;
end $$;
