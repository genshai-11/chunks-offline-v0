-- Fix response finalization lifecycle for CHUNKS live-room rounds.
-- Created: 2026-07-03
--
-- The linked preview database had this failure mode:
-- 1. learner_responses_prepare rejects all writes when the round is no longer open.
-- 2. room_rounds_finalize_responses closes the round, then updates accepted responses to finalized=true.
-- 3. The response update re-enters learner_responses_prepare and fails because the round is now closed.
--
-- This migration allows the narrow finalized=false -> true transition only when
-- the associated round is closed, while keeping finalized responses immutable.

create or replace function public.calculate_live_room_score(
  p_scoring_mode text,
  p_cci_standard_x numeric,
  p_performance_y integer,
  p_cvr_value numeric,
  p_reflection_time_ms integer
)
returns table(reflection_seconds numeric, cci_result numeric, cpd_result numeric)
language plpgsql
immutable
as $$
declare
  v_seconds numeric := greatest(coalesce(p_reflection_time_ms, 0), 0)::numeric / 1000;
  v_cci numeric;
begin
  if p_scoring_mode = 'timed' and v_seconds <= 0 then
    raise exception 'Timed scoring requires a positive reflection time';
  end if;

  if p_scoring_mode = 'timed' then
    v_cci := p_cci_standard_x * (p_performance_y::numeric / v_seconds);
  else
    v_cci := p_cci_standard_x * p_performance_y::numeric;
  end if;

  reflection_seconds := round(v_seconds, 4);
  cci_result := round(v_cci, 4);
  cpd_result := round(v_cci * p_cvr_value, 4);
  return next;
end;
$$;

create or replace function public.prepare_learner_response()
returns trigger
language plpgsql
as $$
declare
  round_record public.room_rounds%rowtype;
  score_record record;
begin
  select * into round_record from public.room_rounds where id = new.round_id;
  if round_record.id is null then
    raise exception 'round not found';
  end if;

  if tg_op = 'UPDATE' and old.finalized then
    raise exception 'finalized response is immutable';
  end if;

  -- Allow the system finalization pass that runs after a round closes.
  -- Preserve the accepted-response scoring snapshot and only flip finalized.
  if tg_op = 'UPDATE' and coalesce(old.finalized, false) = false and new.finalized = true then
    if round_record.status <> 'closed' then
      raise exception 'response can only be finalized after round closes';
    end if;

    new.id = old.id;
    new.round_id = old.round_id;
    new.learner_id = old.learner_id;
    new.response_color = old.response_color;
    new.performance_y = old.performance_y;
    new.reflection_time_ms = old.reflection_time_ms;
    new.reflection_seconds = old.reflection_seconds;
    new.cci_standard_x = old.cci_standard_x;
    new.cvr_value = old.cvr_value;
    new.cci_result = old.cci_result;
    new.cpd_result = old.cpd_result;
    new.scoring_mode_snapshot = old.scoring_mode_snapshot;
    new.response_capture_mode_snapshot = old.response_capture_mode_snapshot;
    new.formula_version_snapshot = old.formula_version_snapshot;
    new.submitted_at = old.submitted_at;
    new.updated_at = now();
    return new;
  end if;

  if round_record.status <> 'open' then
    raise exception 'round is not open';
  end if;

  if round_record.captured_learner_id is not null and round_record.captured_learner_id is distinct from new.learner_id then
    raise exception 'round already captured a response';
  end if;

  if round_record.response_capture_mode_snapshot in ('assigned', 'auto_rotate')
     and round_record.assigned_learner_id is distinct from new.learner_id then
    raise exception 'learner is not assigned to this round';
  end if;

  select * into score_record from public.calculate_live_room_score(
    round_record.scoring_mode_snapshot,
    round_record.cci_standard_x,
    new.performance_y,
    round_record.cvr_value,
    new.reflection_time_ms
  );

  new.cci_standard_x = round_record.cci_standard_x;
  new.cvr_value = round_record.cvr_value;
  new.reflection_seconds = score_record.reflection_seconds;
  new.cci_result = score_record.cci_result;
  new.cpd_result = score_record.cpd_result;
  new.scoring_mode_snapshot = round_record.scoring_mode_snapshot;
  new.response_capture_mode_snapshot = round_record.response_capture_mode_snapshot;
  new.formula_version_snapshot = coalesce(new.formula_version_snapshot, 'simple-v1');
  new.finalized = false;
  new.updated_at = now();
  new.submitted_at = coalesce(new.submitted_at, now());
  return new;
end;
$$;

create or replace function public.finalize_round_responses()
returns trigger
language plpgsql
as $$
begin
  if new.status = 'closed' and old.status is distinct from 'closed' then
    update public.learner_responses
    set finalized = true, updated_at = now()
    where round_id = new.id;
  end if;
  return new;
end;
$$;

do $$
begin
  if not exists (
    select 1
    from pg_trigger
    where tgname = 'learner_responses_prepare'
      and tgrelid = 'public.learner_responses'::regclass
  ) then
    create trigger learner_responses_prepare
      before insert or update on public.learner_responses
      for each row execute function public.prepare_learner_response();
  end if;

  if not exists (
    select 1
    from pg_trigger
    where tgname = 'room_rounds_finalize_responses'
      and tgrelid = 'public.room_rounds'::regclass
  ) then
    create trigger room_rounds_finalize_responses
      after update on public.room_rounds
      for each row execute function public.finalize_round_responses();
  end if;
end $$;
