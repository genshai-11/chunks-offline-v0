-- CHUNKS Mirror / Offline Live Room local seed
-- Deterministic IDs make repeated local/preview seeding idempotent.

insert into public.courses (id, title, status)
values ('00000000-0000-4000-8000-000000000001', 'CHUNKS Demo Course', 'active')
on conflict (id) do update set title = excluded.title, status = excluded.status, updated_at = now();

insert into public.lessons (id, course_id, title, order_index, status)
values ('00000000-0000-4000-8000-000000000011', '00000000-0000-4000-8000-000000000001', 'Demo Lesson: Live Mirror', 1, 'active')
on conflict (id) do update set title = excluded.title, status = excluded.status, updated_at = now();

insert into public.lesson_sections (id, lesson_id, title, order_index, status)
values ('00000000-0000-4000-8000-000000000021', '00000000-0000-4000-8000-000000000011', 'Section 1: Response Warmup', 1, 'active')
on conflict (id) do update set title = excluded.title, status = excluded.status, updated_at = now();

insert into public.cci_categories (id, label, active)
values ('listening-friction', 'Listening Friction', true)
on conflict (id) do update set label = excluded.label, active = excluded.active, updated_at = now();

insert into public.cci_standard_cards (id, category_id, label, standard_value, active)
values
  ('00000000-0000-4000-8000-000000000031', 'listening-friction', 'Stable Recall', 1.00, true),
  ('00000000-0000-4000-8000-000000000032', 'listening-friction', 'Pressure Response', 1.50, true)
on conflict (id) do update set label = excluded.label, standard_value = excluded.standard_value, active = excluded.active, updated_at = now();

insert into public.cvr_units (id, label, unit_symbol, value, active)
values ('00000000-0000-4000-8000-000000000041', 'Default CVR', 'Ω', 10.00, true)
on conflict (id) do update set label = excluded.label, value = excluded.value, active = excluded.active, updated_at = now();

insert into public.sentence_resources (
  id,
  course_id,
  lesson_id,
  section_id,
  sentence_code,
  text_prompt,
  text_en,
  text_vi,
  audio_url,
  audio_en_url,
  audio_vi_url,
  default_cvr_unit_id,
  default_cvr_value,
  cvr_value,
  order_index,
  approval_status
)
values
  (
    '00000000-0000-4000-8000-000000000101',
    '00000000-0000-4000-8000-000000000001',
    '00000000-0000-4000-8000-000000000011',
    '00000000-0000-4000-8000-000000000021',
    'DEMO-001',
    'I am ready to practice.',
    'I am ready to practice.',
    'Tôi đã sẵn sàng luyện tập.',
    null,
    null,
    null,
    '00000000-0000-4000-8000-000000000041',
    10.00,
    10.00,
    1,
    'approved'
  ),
  (
    '00000000-0000-4000-8000-000000000102',
    '00000000-0000-4000-8000-000000000001',
    '00000000-0000-4000-8000-000000000011',
    '00000000-0000-4000-8000-000000000021',
    'DEMO-002',
    'Please say it one more time.',
    'Please say it one more time.',
    'Vui lòng nói lại một lần nữa.',
    null,
    null,
    null,
    '00000000-0000-4000-8000-000000000041',
    12.50,
    12.50,
    2,
    'approved'
  )
on conflict (id) do update set
  sentence_code = excluded.sentence_code,
  text_prompt = excluded.text_prompt,
  text_en = excluded.text_en,
  text_vi = excluded.text_vi,
  default_cvr_value = excluded.default_cvr_value,
  cvr_value = excluded.cvr_value,
  order_index = excluded.order_index,
  approval_status = excluded.approval_status,
  updated_at = now();

insert into public.learners (id, display_name, source)
values
  ('00000000-0000-4000-8000-000000000201', 'Demo Learner A', 'manual'),
  ('00000000-0000-4000-8000-000000000202', 'Demo Learner B', 'manual')
on conflict (id) do update set display_name = excluded.display_name, source = excluded.source, updated_at = now();
