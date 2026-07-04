-- Allow first-responder rounds to accept the first valid learner response.
--
-- Context:
-- The hardened remote INSERT policy currently only allows learner_responses
-- when room_rounds.assigned_learner_id = learner_responses.learner_id.
-- That is correct for assigned/auto_rotate rounds, but first_responder rounds
-- intentionally have assigned_learner_id = null and are protected by the
-- one-response-per-round unique constraint plus prepare_learner_response().

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'learner_responses'
      and policyname = 'learner_responses_insert_first_responder_open'
  ) then
    create policy "learner_responses_insert_first_responder_open"
      on public.learner_responses
      for insert
      with check (
        exists (
          select 1
          from public.room_rounds rr
          join public.room_memberships rm
            on rm.room_id = rr.room_id
           and rm.learner_id = learner_responses.learner_id
          where rr.id = learner_responses.round_id
            and rr.status = 'open'
            and rr.response_capture_mode_snapshot = 'first_responder'
            and rr.assigned_learner_id is null
            and rm.presence_status = 'online'
        )
      );
  end if;
end $$;
