-- Persist the scoring formula version used for each learner response.
-- This keeps live-room history auditable when scoring formulas evolve.

alter table public.learner_responses
  add column if not exists formula_version_snapshot text not null default 'simple-v1';

create or replace function public.prepare_learner_response()
returns trigger
language plpgsql
as $$
declare
  round_record public.room_rounds%rowtype;
  score_record record;
begin
  select * into round_record
  from public.room_rounds
  where id = new.round_id
  for update;

  if not found then
    raise exception 'round not found';
  end if;

  if tg_op = 'UPDATE' and old.finalized = true then
    if new.finalized is distinct from true then
      raise exception 'finalized learner responses are immutable';
    end if;

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
