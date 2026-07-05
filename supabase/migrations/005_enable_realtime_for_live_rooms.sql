-- Enable Supabase Realtime for live room tables (practice_rooms, room_memberships, room_rounds, learner_responses).
-- This ensures postgres_changes events are published for realtime subscriptions used by TeacherRoomPage and LearnerRoomPage.
--
-- IMPORTANT:
-- - For self-hosted or local Supabase: this migration will add the tables to the publication.
-- - For hosted Supabase projects: after applying (or if already applied), verify in Dashboard > Database > Replication that the tables have "Realtime" enabled for the anon key.
-- - Idempotent: uses checks to avoid errors if tables are already in the publication.
-- - Related to T108 and T113 in tasks.md for realtime reliability (fixes for learner join roster and response feedback).

DO $$
BEGIN
  -- practice_rooms
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
      AND schemaname = 'public' 
      AND tablename = 'practice_rooms'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.practice_rooms;
  END IF;

  -- room_memberships
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
      AND schemaname = 'public' 
      AND tablename = 'room_memberships'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.room_memberships;
  END IF;

  -- room_rounds
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
      AND schemaname = 'public' 
      AND tablename = 'room_rounds'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.room_rounds;
  END IF;

  -- learner_responses (note: responses do not have room_id column; handled with broad filter in progressService)
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
      AND schemaname = 'public' 
      AND tablename = 'learner_responses'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.learner_responses;
  END IF;
END $$;