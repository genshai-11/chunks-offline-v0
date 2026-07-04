-- Audio generation job queue for Admin missing-audio workflows.
-- Created: 2026-07-03
--
-- Browser Admin UI may queue resource/language/storage intent only. Provider API
-- keys remain server-side/operator environment values and must never be stored here.

create table if not exists public.audio_generation_jobs (
  id uuid primary key default gen_random_uuid(),
  resource_id uuid not null references public.sentence_resources(id) on delete cascade,
  language text not null check (language in ('en', 'vi')),
  status text not null default 'queued' check (status in ('queued', 'running', 'succeeded', 'failed', 'skipped')),
  provider text,
  model text,
  storage_path text not null,
  public_url text,
  error_message text,
  requested_by text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  completed_at timestamptz,
  unique (resource_id, language, storage_path)
);

create index if not exists idx_audio_generation_jobs_resource_status
  on public.audio_generation_jobs(resource_id, status, created_at desc);

create index if not exists idx_audio_generation_jobs_status
  on public.audio_generation_jobs(status, created_at desc);

alter table public.audio_generation_jobs enable row level security;

-- Development/Admin UI policy. Production hardening remains covered by T060/T081:
-- restrict this to authenticated Admin/operator roles before production release.
do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'audio_generation_jobs'
      and policyname = 'dev admin audio generation job access'
  ) then
    create policy "dev admin audio generation job access"
      on public.audio_generation_jobs
      for all
      using (true)
      with check (true);
  end if;
end $$;
