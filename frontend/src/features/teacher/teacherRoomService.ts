import type { SupabaseClient } from '@supabase/supabase-js'

import type {
  CciStandardCard,
  Course,
  Lesson,
  LessonSection,
  PracticeRoom,
  ResponseCaptureMode,
  ScoringMode,
  UUID,
} from '../../lib/domain/types'
import { mapSupabaseError } from '../../lib/domain/errors'
import { assertSupabaseConfig, supabase as defaultSupabase } from '../../lib/supabase/client'

export interface TeacherSetupOptions {
  client?: SupabaseClient
}

export interface TeacherSetupData {
  courses: Course[]
  lessons: Lesson[]
  sections: LessonSection[]
  cciCards: CciStandardCard[]
}

export interface ResourceScopeInput {
  courseId: UUID
  lessonId: UUID
  sectionIds: UUID[]
}

export interface CreateRoomInput extends ResourceScopeInput {
  title: string
  hostName: string
  cciStandardCardId: UUID
  captureMode: ResponseCaptureMode
  scoringMode: ScoringMode
}

export interface CreatedRoomResult {
  room: PracticeRoom
  shareLink: string
}

export async function loadTeacherSetupData({
  client = defaultSupabase,
}: TeacherSetupOptions = {}): Promise<TeacherSetupData> {
  assertSupabaseConfig()

  const [coursesResult, lessonsResult, sectionsResult, cciCardsResult] = await Promise.all([
    client.from('courses').select('*').eq('status', 'active').order('title'),
    client.from('lessons').select('*').neq('status', 'archived').order('course_id').order('order_index'),
    client.from('lesson_sections').select('*').eq('status', 'active').order('lesson_id').order('order_index'),
    client.from('cci_standard_cards').select('*').eq('active', true).order('label'),
  ])

  for (const result of [coursesResult, lessonsResult, sectionsResult, cciCardsResult]) {
    if (result.error) throw mapSupabaseError(result.error)
  }

  return {
    courses: (coursesResult.data ?? []) as Course[],
    lessons: (lessonsResult.data ?? []) as Lesson[],
    sections: (sectionsResult.data ?? []) as LessonSection[],
    cciCards: (cciCardsResult.data ?? []) as CciStandardCard[],
  }
}

export async function countApprovedSentenceResources(
  input: ResourceScopeInput,
  { client = defaultSupabase }: TeacherSetupOptions = {},
): Promise<number> {
  assertSupabaseConfig()

  if (!input.courseId || !input.lessonId || input.sectionIds.length === 0) return 0

  const resourcesResult = await client
    .from('sentence_resources')
    .select('id', { count: 'exact', head: true })
    .eq('approval_status', 'approved')
    .eq('course_id', input.courseId)
    .eq('lesson_id', input.lessonId)
    .in('section_id', input.sectionIds)

  if (resourcesResult.error) throw mapSupabaseError(resourcesResult.error)
  return resourcesResult.count ?? 0
}

export async function createTeacherRoom(
  input: CreateRoomInput,
  { client = defaultSupabase }: TeacherSetupOptions = {},
): Promise<CreatedRoomResult> {
  assertSupabaseConfig()

  if (input.sectionIds.length === 0) {
    throw new Error('Select at least one topic from the lesson before creating a room.')
  }

  const resourcesResult = await client
    .from('sentence_resources')
    .select('id')
    .eq('approval_status', 'approved')
    .eq('course_id', input.courseId)
    .eq('lesson_id', input.lessonId)
    .in('section_id', input.sectionIds)
    .order('order_index')

  if (resourcesResult.error) throw mapSupabaseError(resourcesResult.error)

  const resourceIds = (resourcesResult.data ?? []).map((resource) => resource.id as UUID)
  if (resourceIds.length === 0) {
    throw new Error('No approved sentence resources found for the selected scope.')
  }

  const roomCode = await generateUniqueRoomCode(client)
  const insertResult = await client
    .from('practice_rooms')
    .insert({
      room_code: roomCode,
      title: input.title.trim() || `CHUNKS Room ${roomCode}`,
      status: 'lobby',
      course_id: input.courseId,
      lesson_id: input.lessonId,
      host_name: input.hostName.trim() || 'Chunker',
      resource_scope_filter: {
        course_id: input.courseId,
        lesson_id: input.lessonId,
        section_ids: input.sectionIds,
        cci_standard_card_id: input.cciStandardCardId,
      },
      snapshot_sentence_resource_ids: resourceIds,
      scope_refreshed_at: new Date().toISOString(),
      scoring_mode: input.scoringMode,
      default_response_capture_mode: input.captureMode,
    })
    .select('*')
    .single()

  if (insertResult.error) throw mapSupabaseError(insertResult.error)

  const room = insertResult.data as PracticeRoom
  return {
    room,
    shareLink: `${window.location.origin}/room/${room.room_code}`,
  }
}

async function generateUniqueRoomCode(client: SupabaseClient): Promise<string> {
  for (let attempt = 0; attempt < 8; attempt += 1) {
    const roomCode = createRoomCode()
    const { data, error } = await client.from('practice_rooms').select('id').eq('room_code', roomCode).maybeSingle()
    if (error) throw mapSupabaseError(error)
    if (!data) return roomCode
  }

  throw new Error('Could not generate a unique room code. Please try again.')
}

function createRoomCode(): string {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  const values = crypto.getRandomValues(new Uint32Array(6))
  return Array.from(values, (value) => alphabet[value % alphabet.length]).join('')
}
