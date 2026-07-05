-- Extend live-room learner response scale to four options.
-- Default scale: red=0, yellow=1, green=2, purple=3.

alter table public.learner_responses
  drop constraint if exists learner_responses_response_color_check;

alter table public.learner_responses
  drop constraint if exists learner_responses_performance_y_check;

alter table public.learner_responses
  add constraint learner_responses_response_color_check
  check (response_color in ('red', 'yellow', 'green', 'purple'));

alter table public.learner_responses
  add constraint learner_responses_performance_y_check
  check (performance_y in (0, 1, 2, 3));
