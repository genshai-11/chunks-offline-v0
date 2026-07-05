export type UUID = string

export type ResourceStatus = 'draft' | 'active' | 'archived'
export type ApprovalStatus = 'draft' | 'approved' | 'archived'
export type RoomStatus = 'lobby' | 'round_open' | 'round_closed' | 'finished'
export type RoundStatus = 'draft' | 'open' | 'closed'
export type ResponseCaptureMode = 'assigned' | 'first_responder' | 'auto_rotate'
export type ScoringMode = 'simple' | 'timed'
export type ResponseColor = 'red' | 'yellow' | 'green' | 'purple'
export type LearnerPerformanceY = 0 | 1 | 2 | 3
export type LearnerState =
  | 'waiting'
  | 'assigned'
  | 'observing'
  | 'captured'
  | 'already_responded'
  | 'round_closed'

export interface Course {
  id: UUID
  title: string
  status: ResourceStatus
  created_at: string
  updated_at: string
}

export interface Lesson {
  id: UUID
  course_id: UUID
  title: string
  order_index: number
  status: ResourceStatus
  created_at: string
  updated_at: string
}

export interface LessonSection {
  id: UUID
  lesson_id: UUID
  title: string
  order_index: number
  status: ResourceStatus
  created_at: string
  updated_at: string
}

export interface SentenceResource {
  id: UUID
  course_id: UUID
  lesson_id: UUID
  section_id: UUID | null
  sentence_code: string
  text_prompt: string | null
  text_en: string | null
  text_vi: string | null
  audio_url: string | null
  audio_en_url: string | null
  audio_vi_url: string | null
  audio_variants: Record<string, unknown>
  default_cvr_unit_id: UUID | null
  default_cvr_value: number
  cvr_value: number
  order_index: number
  approval_status: ApprovalStatus
  created_at: string
  updated_at: string
}

export interface CciCategory {
  id: string
  label: string
  active: boolean
  created_at: string
  updated_at: string
}

export interface CciStandardCard {
  id: UUID
  category_id: string
  label: string
  standard_value: number
  active: boolean
  created_at: string
  updated_at: string
}

export interface CvrUnit {
  id: UUID
  label: string
  unit_symbol: string
  value: number
  active: boolean
  created_at: string
  updated_at: string
}

export type AudioGenerationStatus = 'queued' | 'running' | 'succeeded' | 'failed' | 'skipped'
export type AudioGenerationLanguage = 'en' | 'vi'

export interface AudioGenerationJob {
  id: UUID
  resource_id: UUID
  language: AudioGenerationLanguage
  status: AudioGenerationStatus
  provider: string | null
  model: string | null
  storage_path: string | null
  public_url: string | null
  error_message: string | null
  requested_by: string | null
  created_at: string
  updated_at: string
  completed_at: string | null
}

export interface Learner {
  id: UUID
  auth_user_id: UUID | null
  display_name: string
  source: 'manual' | 'imported' | 'anonymous'
  last_seen_at: string | null
  created_at: string
  updated_at: string
}

export interface PracticeRoom {
  id: UUID
  room_code: string
  title: string
  status: RoomStatus
  current_round_id: UUID | null
  course_id: UUID | null
  lesson_id: UUID | null
  host_name: string | null
  resource_scope_filter: Record<string, unknown>
  snapshot_sentence_resource_ids: UUID[]
  scope_refreshed_at: string | null
  scoring_mode: ScoringMode
  default_response_capture_mode: ResponseCaptureMode
  teacher_pin_hash: string | null
  created_at: string
  updated_at: string
}

export interface RoomMembership {
  id: UUID
  room_id: UUID
  learner_id: UUID
  presence_status: 'online' | 'offline' | 'left'
  can_answer: boolean
  joined_at: string
  updated_at: string
}

export interface RoomRound {
  id: UUID
  room_id: UUID
  sentence_resource_id: UUID
  assigned_learner_id: UUID | null
  captured_learner_id: UUID | null
  cci_standard_card_id: UUID | null
  cci_standard_x: number
  cvr_value: number
  round_index: number
  status: RoundStatus
  response_capture_mode_snapshot: ResponseCaptureMode
  scoring_mode_snapshot: ScoringMode
  opened_by: string | null
  sequence_key: string | null
  opened_at: string | null
  closed_at: string | null
  created_at: string
  updated_at: string
}

export interface LearnerResponse {
  id: UUID
  round_id: UUID
  learner_id: UUID
  performance_y: LearnerPerformanceY
  response_color: ResponseColor
  cci_standard_x: number
  cvr_value: number
  cci_result: number
  cpd_result: number
  reflection_time_ms: number
  reflection_seconds: number
  finalized: boolean
  scoring_mode_snapshot: ScoringMode
  response_capture_mode_snapshot: ResponseCaptureMode
  formula_version_snapshot: string
  submitted_at: string
  updated_at: string
}

export interface LearnerProgressSummary {
  learner_id: UUID
  response_count: number
  red_count: number
  yellow_count: number
  green_count: number
  purple_count: number
  highest_cpd: number
  total_cpd: number
  average_cpd: number
  average_reflection_seconds: number
  last_response_at: string | null
}
