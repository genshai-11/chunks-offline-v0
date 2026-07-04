-- Response validation checks for CHUNKS Mirror / Offline Live Room.
-- Run against a disposable local/preview database after migrations + seed data.
-- Covers US2 negative paths and the round-close response finalization lifecycle.

begin;

create temp table response_validation_results (
  step text primary key,
  passed boolean not null,
  detail text not null
) on commit drop;

-- The MVP schema must enforce one tracked response per round.
do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conrelid = 'public.learner_responses'::regclass
      and contype = 'u'
      and conname like '%round%'
  ) then
    raise exception 'Expected learner_responses to have a unique constraint on round_id';
  end if;

  insert into response_validation_results
  values ('unique-round-constraint', true, 'learner_responses has a unique round-level response constraint');
end $$;

create temp table response_validation_ids (
  room_id uuid,
  sentence_id uuid,
  assigned_learner_id uuid,
  observing_learner_id uuid,
  round_id uuid,
  response_id uuid
) on commit drop;

with picked as (
  select
    sr.id as sentence_id,
    sr.course_id,
    sr.lesson_id,
    coalesce(sr.cvr_value, sr.default_cvr_value, 1) as cvr_value,
    cci.id as cci_id,
    cci.standard_value as cci_x
  from public.sentence_resources sr
  cross join lateral (
    select id, standard_value from public.cci_standard_cards where active = true order by label limit 1
  ) cci
  where sr.approval_status = 'approved'
  order by sr.order_index
  limit 1
), room_i as (
  insert into public.practice_rooms (
    room_code,
    title,
    status,
    course_id,
    lesson_id,
    host_name,
    resource_scope_filter,
    snapshot_sentence_resource_ids,
    scope_refreshed_at,
    scoring_mode,
    default_response_capture_mode
  )
  select
    'RVSQL1',
    'Rollback response validation room',
    'lobby',
    course_id,
    lesson_id,
    'SQL Validator',
    '{}'::jsonb,
    array[sentence_id]::uuid[],
    now(),
    'simple',
    'assigned'
  from picked
  returning *
), learners_i as (
  insert into public.learners (auth_user_id, display_name, source, last_seen_at)
  values
    (gen_random_uuid(), 'SQL Assigned Learner', 'anonymous', now()),
    (gen_random_uuid(), 'SQL Observing Learner', 'anonymous', now())
  returning *
), memberships_i as (
  insert into public.room_memberships (room_id, learner_id, presence_status, can_answer)
  select room_i.id, learners_i.id, 'online', false from room_i cross join learners_i returning *
), assigned as (
  select id from learners_i where display_name = 'SQL Assigned Learner'
), observer as (
  select id from learners_i where display_name = 'SQL Observing Learner'
), round_i as (
  insert into public.room_rounds (
    room_id,
    sentence_resource_id,
    assigned_learner_id,
    cci_standard_card_id,
    cci_standard_x,
    cvr_value,
    round_index,
    status,
    response_capture_mode_snapshot,
    scoring_mode_snapshot,
    opened_by,
    sequence_key,
    opened_at
  )
  select room_i.id, picked.sentence_id, assigned.id, picked.cci_id, picked.cci_x, picked.cvr_value,
    1, 'open', 'assigned', 'simple', 'SQL Validator', 'RVSQL1-1', now()
  from room_i cross join picked cross join assigned
  returning *
), response_i as (
  insert into public.learner_responses (
    round_id,
    learner_id,
    response_color,
    performance_y,
    reflection_time_ms
  )
  select round_i.id, round_i.assigned_learner_id, 'green', 2, 1200
  from round_i
  returning *
)
insert into response_validation_ids(room_id, sentence_id, assigned_learner_id, observing_learner_id, round_id, response_id)
select room_i.id, picked.sentence_id, assigned.id, observer.id, round_i.id, response_i.id
from room_i cross join picked cross join assigned cross join observer cross join round_i cross join response_i;

insert into response_validation_results
select 'valid-response-snapshots',
  exists (
    select 1
    from public.learner_responses lr
    join response_validation_ids ids on ids.response_id = lr.id
    where lr.response_color = 'green'
      and lr.performance_y = 2
      and lr.cci_result >= 0
      and lr.cpd_result >= 0
      and lr.reflection_seconds = 1.2
  ),
  'Accepted Green response stores Y, reflection, CCI, and CPD snapshots';

-- Duplicate should fail because learner_responses has unique(round_id).
do $$
declare
  ids response_validation_ids%rowtype;
begin
  select * into ids from response_validation_ids limit 1;

  begin
    insert into public.learner_responses (round_id, learner_id, response_color, performance_y, reflection_time_ms)
    values (ids.round_id, ids.assigned_learner_id, 'red', 0, 1300);
    insert into response_validation_results values ('duplicate-rejected', false, 'Duplicate insert unexpectedly succeeded');
  exception
    when others then
      insert into response_validation_results values ('duplicate-rejected', true, SQLERRM);
  end;
end $$;

-- Observing learner in assigned mode must fail on direct persistence.
do $$
declare
  ids response_validation_ids%rowtype;
  cci_id_v uuid;
  cci_x_v numeric;
  cvr_v numeric;
  round2_id uuid;
begin
  select * into ids from response_validation_ids limit 1;
  select id, standard_value into cci_id_v, cci_x_v from public.cci_standard_cards where active = true order by label limit 1;
  select coalesce(cvr_value, default_cvr_value, 1) into cvr_v from public.sentence_resources where id = ids.sentence_id;

  insert into public.room_rounds (
    room_id,
    sentence_resource_id,
    assigned_learner_id,
    cci_standard_card_id,
    cci_standard_x,
    cvr_value,
    round_index,
    status,
    response_capture_mode_snapshot,
    scoring_mode_snapshot,
    opened_by,
    sequence_key,
    opened_at
  ) values (ids.room_id, ids.sentence_id, ids.assigned_learner_id, cci_id_v, cci_x_v, cvr_v,
    2, 'open', 'assigned', 'simple', 'SQL Validator', 'RVSQL1-2', now())
  returning id into round2_id;

  begin
    insert into public.learner_responses (round_id, learner_id, response_color, performance_y, reflection_time_ms)
    values (round2_id, ids.observing_learner_id, 'yellow', 1, 900);
    insert into response_validation_results values ('observing-rejected', false, 'Observing learner insert unexpectedly succeeded');
  exception
    when others then
      insert into response_validation_results values ('observing-rejected', true, SQLERRM);
  end;
end $$;

-- Closed round must fail on direct persistence.
do $$
declare
  ids response_validation_ids%rowtype;
  cci_id_v uuid;
  cci_x_v numeric;
  cvr_v numeric;
  round3_id uuid;
begin
  select * into ids from response_validation_ids limit 1;
  select id, standard_value into cci_id_v, cci_x_v from public.cci_standard_cards where active = true order by label limit 1;
  select coalesce(cvr_value, default_cvr_value, 1) into cvr_v from public.sentence_resources where id = ids.sentence_id;

  insert into public.room_rounds (
    room_id,
    sentence_resource_id,
    assigned_learner_id,
    cci_standard_card_id,
    cci_standard_x,
    cvr_value,
    round_index,
    status,
    response_capture_mode_snapshot,
    scoring_mode_snapshot,
    opened_by,
    sequence_key,
    opened_at,
    closed_at
  ) values (ids.room_id, ids.sentence_id, ids.assigned_learner_id, cci_id_v, cci_x_v, cvr_v,
    3, 'closed', 'assigned', 'simple', 'SQL Validator', 'RVSQL1-3', now(), now())
  returning id into round3_id;

  begin
    insert into public.learner_responses (round_id, learner_id, response_color, performance_y, reflection_time_ms)
    values (round3_id, ids.assigned_learner_id, 'green', 2, 800);
    insert into response_validation_results values ('closed-round-rejected', false, 'Closed round insert unexpectedly succeeded');
  exception
    when others then
      insert into response_validation_results values ('closed-round-rejected', true, SQLERRM);
  end;
end $$;

-- First responder mode must accept an online room member even when assigned_learner_id is null.
do $$
declare
  ids response_validation_ids%rowtype;
  cci_id_v uuid;
  cci_x_v numeric;
  cvr_v numeric;
  round4_id uuid;
begin
  select * into ids from response_validation_ids limit 1;
  select id, standard_value into cci_id_v, cci_x_v from public.cci_standard_cards where active = true order by label limit 1;
  select coalesce(cvr_value, default_cvr_value, 1) into cvr_v from public.sentence_resources where id = ids.sentence_id;

  update public.room_memberships
  set presence_status = 'online'
  where room_id = ids.room_id and learner_id = ids.observing_learner_id;

  insert into public.room_rounds (
    room_id,
    sentence_resource_id,
    assigned_learner_id,
    cci_standard_card_id,
    cci_standard_x,
    cvr_value,
    round_index,
    status,
    response_capture_mode_snapshot,
    scoring_mode_snapshot,
    opened_by,
    sequence_key,
    opened_at
  ) values (ids.room_id, ids.sentence_id, null, cci_id_v, cci_x_v, cvr_v,
    4, 'open', 'first_responder', 'simple', 'SQL Validator', 'RVSQL1-4', now())
  returning id into round4_id;

  begin
    insert into public.learner_responses (round_id, learner_id, response_color, performance_y, reflection_time_ms)
    values (round4_id, ids.observing_learner_id, 'yellow', 1, 700);
    insert into response_validation_results values ('first-responder-accepted', true, 'First responder insert succeeded for online room member');
  exception
    when others then
      insert into response_validation_results values ('first-responder-accepted', false, SQLERRM);
  end;
end $$;

-- Closing an open round with a response must finalize the accepted response.
do $$
declare
  ids response_validation_ids%rowtype;
  is_finalized boolean;
begin
  select * into ids from response_validation_ids limit 1;

  update public.room_rounds
  set status = 'closed', closed_at = now()
  where id = ids.round_id;

  select finalized into is_finalized
  from public.learner_responses
  where id = ids.response_id;

  insert into response_validation_results
  values ('close-finalizes-response', coalesce(is_finalized, false), 'Round close flips accepted response to finalized=true');
end $$;

select step, passed, detail
from response_validation_results
order by step;

rollback;
