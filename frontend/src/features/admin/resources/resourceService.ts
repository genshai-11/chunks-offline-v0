import type { SupabaseClient } from '@supabase/supabase-js'

import { mapSupabaseError } from '../../../lib/domain/errors'
import type {
  ApprovalStatus,
  AudioGenerationLanguage,
  Course,
  Lesson,
  LessonSection,
  SentenceResource,
  UUID,
} from '../../../lib/domain/types'
import { assertSupabaseConfig, supabase as defaultSupabase } from '../../../lib/supabase/client'

export interface ResourceManagerData {
  courses: Course[]
  lessons: Lesson[]
  resources: SentenceResource[]
  sections: LessonSection[]
}

export interface SaveSentenceResourceInput {
  id?: UUID
  courseId: UUID
  lessonId: UUID
  sectionId: UUID | null
  sentenceCode: string
  textEn: string
  textVi: string
  audioEnUrl: string | null
  audioViUrl: string | null
  cvrValue: number
  approvalStatus: ApprovalStatus
  orderIndex?: number
}

export interface BatchApprovalInput {
  approvalStatus: ApprovalStatus
  resourceIds: UUID[]
}

export interface BatchApprovalResult {
  updatedCount: number
}

export interface AudioGenerationRequest {
  language: AudioGenerationLanguage
  resourceId: UUID
  storagePath?: string
}

export interface AudioGenerationQueueItem extends AudioGenerationRequest {
  sentenceCode: string
}

export interface AudioGenerationRequestResult {
  queuedCount: number
  status: 'queued'
  message: string
}

export interface ResourceServiceOptions {
  client?: SupabaseClient
}

export async function loadResourceManagerData({
  client = defaultSupabase,
}: ResourceServiceOptions = {}): Promise<ResourceManagerData> {
  assertSupabaseConfig()

  const [coursesResult, lessonsResult, sectionsResult, resourcesResult] = await Promise.all([
    client.from('courses').select('*').neq('status', 'archived').order('title'),
    client.from('lessons').select('*').neq('status', 'archived').order('course_id').order('order_index'),
    client.from('lesson_sections').select('*').neq('status', 'archived').order('lesson_id').order('order_index'),
    client.from('sentence_resources').select('*').neq('approval_status', 'archived').order('course_id').order('lesson_id').order('order_index'),
  ])

  for (const result of [coursesResult, lessonsResult, sectionsResult, resourcesResult]) {
    if (result.error) throw mapSupabaseError(result.error)
  }

  return {
    courses: (coursesResult.data ?? []) as Course[],
    lessons: (lessonsResult.data ?? []) as Lesson[],
    sections: (sectionsResult.data ?? []) as LessonSection[],
    resources: (resourcesResult.data ?? []) as SentenceResource[],
  }
}

export async function saveSentenceResource(
  input: SaveSentenceResourceInput,
  { client = defaultSupabase }: ResourceServiceOptions = {},
): Promise<SentenceResource> {
  assertSupabaseConfig()

  const payload = {
    course_id: input.courseId,
    lesson_id: input.lessonId,
    section_id: input.sectionId,
    sentence_code: input.sentenceCode.trim(),
    text_en: input.textEn.trim() || null,
    text_vi: input.textVi.trim() || null,
    audio_en_url: input.audioEnUrl?.trim() || null,
    audio_vi_url: input.audioViUrl?.trim() || null,
    cvr_value: Math.max(0, input.cvrValue),
    approval_status: input.approvalStatus,
    order_index: input.orderIndex ?? 1,
  }

  const query = input.id
    ? client.from('sentence_resources').update(payload).eq('id', input.id)
    : client.from('sentence_resources').insert(payload)

  const result = await query.select('*').single()
  if (result.error) throw mapSupabaseError(result.error)
  return result.data as SentenceResource
}

export async function batchUpdateApprovalStatus(
  input: BatchApprovalInput,
  { client = defaultSupabase }: ResourceServiceOptions = {},
): Promise<BatchApprovalResult> {
  assertSupabaseConfig()
  if (input.resourceIds.length === 0) return { updatedCount: 0 }

  const result = await client
    .from('sentence_resources')
    .update({ approval_status: input.approvalStatus })
    .in('id', input.resourceIds)
    .select('id')

  if (result.error) throw mapSupabaseError(result.error)
  return { updatedCount: result.data?.length ?? 0 }
}

export async function requestAudioGeneration(
  input: AudioGenerationRequest,
  { client = defaultSupabase }: ResourceServiceOptions = {},
): Promise<AudioGenerationRequestResult> {
  return requestAudioGenerationBatch([{ ...input, sentenceCode: '' }], { client })
}

export async function requestAudioGenerationBatch(
  inputs: AudioGenerationQueueItem[],
  { client = defaultSupabase }: ResourceServiceOptions = {},
): Promise<AudioGenerationRequestResult> {
  assertSupabaseConfig()
  if (inputs.length === 0) return { queuedCount: 0, status: 'queued', message: 'No missing audio jobs to queue.' }

  // Secure-by-design: browser sends only resource/language/storage intent. Provider keys
  // remain server-side/operator-script environment values and are never accepted here.
  const rows = inputs.map((input) => ({
    resource_id: input.resourceId,
    language: input.language,
    status: 'queued',
    provider: 'secure-operator',
    requested_by: 'admin-ui',
    storage_path: input.storagePath,
  }))

  const result = await client
    .from('audio_generation_jobs')
    .upsert(rows, { ignoreDuplicates: true, onConflict: 'resource_id,language,storage_path' })
  if (result.error) {
    if (isMissingAudioGenerationJobsTableError(result.error)) {
      throw new Error(
        'Audio generation queue table is not installed in Supabase yet. Apply supabase/migrations/003_audio_generation_jobs.sql, then retry this action.',
      )
    }
    throw mapSupabaseError(result.error)
  }

  return {
    queuedCount: rows.length,
    status: 'queued',
    message: `Queued ${rows.length} secure audio generation ${rows.length === 1 ? 'job' : 'jobs'}.`,
  }
}

export function buildAudioStoragePath(resource: SentenceResource, language: AudioGenerationLanguage): string {
  return [
    'sentence-audio',
    sanitizePathPart(resource.course_id),
    sanitizePathPart(resource.lesson_id),
    `${sanitizePathPart(resource.sentence_code)}-${language}.mp3`,
  ].join('/')
}

export function getMissingAudioQueueItems(resources: SentenceResource[]): AudioGenerationQueueItem[] {
  return resources.flatMap((resource) => {
    const jobs: AudioGenerationQueueItem[] = []
    if (!resource.audio_en_url) {
      jobs.push({
        language: 'en',
        resourceId: resource.id,
        sentenceCode: resource.sentence_code,
        storagePath: buildAudioStoragePath(resource, 'en'),
      })
    }
    if (!resource.audio_vi_url) {
      jobs.push({
        language: 'vi',
        resourceId: resource.id,
        sentenceCode: resource.sentence_code,
        storagePath: buildAudioStoragePath(resource, 'vi'),
      })
    }
    return jobs
  })
}

export function filterResourcesByAudio(resources: SentenceResource[], filter: 'all' | 'missing-en' | 'missing-vi') {
  if (filter === 'missing-en') return resources.filter((resource) => !resource.audio_en_url)
  if (filter === 'missing-vi') return resources.filter((resource) => !resource.audio_vi_url)
  return resources
}

function isMissingAudioGenerationJobsTableError(error: { code?: string; message?: string; details?: string }): boolean {
  const text = `${error.code ?? ''} ${error.message ?? ''} ${error.details ?? ''}`.toLowerCase()
  return text.includes('audio_generation_jobs') && (text.includes('404') || text.includes('not found') || text.includes('does not exist') || text.includes('schema cache'))
}

function sanitizePathPart(value: string | null | undefined): string {
  return String(value ?? 'unknown')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'unknown'
}
