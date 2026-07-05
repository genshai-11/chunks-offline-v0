import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.52.0'

const DEFAULT_BUCKET = 'resource-audio'
const DEFAULT_BASE_URL = 'https://rbkqhml.abc-tunnel.us/v1'
const DEFAULT_MODELS: Record<Language, string> = {
  en: 'edge-tts/en-US-BrianNeural',
  vi: 'edge-tts/vi-VN-HoaiMyNeural',
}
const MAX_LIMIT = 50

type Language = 'en' | 'vi'

type GenerateRequest = {
  language?: Language
  courseTitle?: string
  limit?: number
  dryRun?: boolean
  bucket?: string
  model?: string
  overwrite?: boolean
  fallbackToTextEn?: boolean
  adminPin?: string
}

type SentenceResourceRow = {
  id: string
  course_id: string
  lesson_id: string
  section_id: string | null
  order_index: number | null
  sentence_code: string | null
  text_en: string | null
  text_vi: string | null
  audio_en_url: string | null
  audio_vi_url: string | null
}

type NamedRow = { id: string; title: string | null; order_index?: number | null }

type Job = SentenceResourceRow & {
  course_title: string
  lesson_title: string
  section_title: string | null
  target: string
  text: string
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, apikey, content-type, x-tts-admin-token',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return json({ error: 'method_not_allowed' }, 405)
  }

  try {
    const body = (await req.json().catch(() => ({}))) as GenerateRequest
    assertAuthorized(req, body)

    const language: Language = body.language === 'en' ? 'en' : 'vi'
    const dryRun = body.dryRun === true
    const limit = clampLimit(body.limit)
    const bucket = body.bucket?.trim() || DEFAULT_BUCKET
    const baseUrl = Deno.env.get('NINEROUTER_URL')?.trim() || DEFAULT_BASE_URL
    const providerKey = Deno.env.get('NINEROUTER_KEY')?.trim()
    const model = body.model?.trim() || DEFAULT_MODELS[language]

    const supabase = createAdminClient()
    const jobs = await loadJobs(supabase, {
      language,
      courseTitle: body.courseTitle?.trim(),
      limit,
      overwrite: body.overwrite === true,
      fallbackToTextEn: body.fallbackToTextEn !== false,
    })

    if (dryRun) {
      return json({
        language,
        model,
        dryRun: true,
        jobs: jobs.length,
        courseTitle: body.courseTitle ?? null,
        limit,
        fallbackToTextEn: body.fallbackToTextEn !== false,
        sample: jobs.slice(0, 10).map((job) => ({
          id: job.id,
          course: job.course_title,
          lesson: job.lesson_title,
          section: job.section_title,
          sentenceCode: job.sentence_code,
          target: job.target,
          text: job.text.slice(0, 120),
        })),
      })
    }

    if (!providerKey) {
      return json({
        error: 'missing_provider_secret',
        message: 'Set NINEROUTER_KEY as a Supabase Edge Function secret before non-dry-run generation.',
      }, 500)
    }

    const processed: Array<{ id: string; target: string }> = []
    const failures: Array<{ id: string; error: string }> = []
    const audioColumn = language === 'vi' ? 'audio_vi_url' : 'audio_en_url'

    for (const job of jobs) {
      try {
        const audio = await generateSpeechMp3({ baseUrl, providerKey, model, text: speechInput(job.text, language) })
        const upload = await supabase.storage.from(bucket).upload(job.target, audio, {
          contentType: 'audio/mpeg',
          cacheControl: '31536000',
          upsert: true,
        })
        if (upload.error) throw upload.error

        const { error: updateError } = await supabase
          .from('sentence_resources')
          .update({ [audioColumn]: job.target, updated_at: new Date().toISOString() })
          .eq('id', job.id)
        if (updateError) throw updateError

        processed.push({ id: job.id, target: job.target })
      } catch (error) {
        failures.push({ id: job.id, error: errorMessage(error).slice(0, 500) })
      }
    }

    return json({
      language,
      model,
      dryRun: false,
      requested: jobs.length,
      processed: processed.length,
      failures,
      remainingHint: 'Invoke again with the same filters to process the next missing batch.',
    }, failures.length > 0 ? 207 : 200)
  } catch (error) {
    const message = errorMessage(error)
    const status = message === 'unauthorized' ? 401 : 500
    return json({ error: status === 401 ? 'unauthorized' : 'internal_error', message }, status)
  }
})

function json(payload: unknown, status = 200): Response {
  return Response.json(payload, { status, headers: corsHeaders })
}

function assertAuthorized(req: Request, body: GenerateRequest): void {
  const token = bearerToken(req.headers.get('authorization'))
  const apiKey = req.headers.get('apikey')?.trim() || ''
  const adminToken = req.headers.get('x-tts-admin-token')?.trim() || ''
  const bodyAdminPin = body.adminPin?.trim() || ''
  const configuredAdminToken = Deno.env.get('TTS_ADMIN_TOKEN')?.trim() || ''
  const legacyAdminPin = Deno.env.get('TTS_ADMIN_PIN')?.trim() || ''
  const acceptedKeys = getSupabaseSecretKeys()

  if (configuredAdminToken && adminToken && safeEqual(adminToken, configuredAdminToken)) return
  if (legacyAdminPin && adminToken && safeEqual(adminToken, legacyAdminPin)) return
  if (legacyAdminPin && bodyAdminPin && safeEqual(bodyAdminPin, legacyAdminPin)) return
  if (token && acceptedKeys.some((key) => safeEqual(token, key))) return
  if (apiKey && acceptedKeys.some((key) => safeEqual(apiKey, key))) return

  throw new Error('unauthorized')
}

function createAdminClient() {
  const url = Deno.env.get('SUPABASE_URL')
  const secretKey = getSupabaseSecretKeys()[0]
  if (!url || !secretKey) {
    throw new Error('Missing SUPABASE_URL or Supabase secret key environment variable.')
  }
  return createClient(url, secretKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}

function getSupabaseSecretKeys(): string[] {
  const keys: string[] = []
  const legacy = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')?.trim()
  if (legacy) keys.push(legacy)

  const modern = Deno.env.get('SUPABASE_SECRET_KEYS')?.trim()
  if (modern) {
    try {
      const parsed = JSON.parse(modern) as Record<string, string>
      keys.push(...Object.values(parsed).filter(Boolean))
    } catch {
      // Ignore malformed secret-key JSON and fall back to legacy key if present.
    }
  }

  return [...new Set(keys)]
}

function bearerToken(header: string | null): string {
  if (!header) return ''
  const match = header.match(/^Bearer\s+(.+)$/i)
  return match?.[1]?.trim() || ''
}

function safeEqual(left: string, right: string): boolean {
  if (!left || !right || left.length !== right.length) return false
  let result = 0
  for (let i = 0; i < left.length; i += 1) {
    result |= left.charCodeAt(i) ^ right.charCodeAt(i)
  }
  return result === 0
}

function clampLimit(value: number | undefined): number {
  if (!Number.isFinite(value)) return 10
  return Math.min(Math.max(Math.trunc(value || 10), 1), MAX_LIMIT)
}

async function loadJobs(
  supabase: ReturnType<typeof createClient>,
  options: { language: Language; courseTitle?: string; limit: number; overwrite: boolean; fallbackToTextEn: boolean },
): Promise<Job[]> {
  const textColumn = options.language === 'vi' && options.fallbackToTextEn ? 'text_en' : options.language === 'vi' ? 'text_vi' : 'text_en'
  const audioColumn = options.language === 'vi' ? 'audio_vi_url' : 'audio_en_url'

  let courseMap = new Map<string, string>()
  let courseIds: string[] | undefined
  if (options.courseTitle) {
    const { data, error } = await supabase.from('courses').select('id,title').eq('title', options.courseTitle)
    if (error) throw error
    courseMap = new Map((data ?? []).map((course: NamedRow) => [course.id, course.title || 'course']))
    courseIds = [...courseMap.keys()]
    if (courseIds.length === 0) return []
  } else {
    const { data, error } = await supabase.from('courses').select('id,title')
    if (error) throw error
    courseMap = new Map((data ?? []).map((course: NamedRow) => [course.id, course.title || 'course']))
  }

  let query = supabase
    .from('sentence_resources')
    .select('id,course_id,lesson_id,section_id,order_index,sentence_code,text_en,text_vi,audio_en_url,audio_vi_url')
    .not(textColumn, 'is', null)
    .neq(textColumn, '')
    .order('order_index', { ascending: true })
    .limit(options.limit)

  if (!options.overwrite) {
    query = query.or(`${audioColumn}.is.null,${audioColumn}.eq.`)
  }
  if (courseIds) {
    query = query.in('course_id', courseIds)
  }

  const { data: resources, error } = await query
  if (error) throw error
  if (!resources?.length) return []

  const lessonIds = unique(resources.map((row: SentenceResourceRow) => row.lesson_id))
  const sectionIds = unique(resources.map((row: SentenceResourceRow) => row.section_id).filter(Boolean) as string[])
  const lessonMap = await loadNameMap(supabase, 'lessons', lessonIds)
  const sectionMap = await loadNameMap(supabase, 'lesson_sections', sectionIds)

  return resources.map((row: SentenceResourceRow) => {
    const courseTitle = courseMap.get(row.course_id) || 'course'
    const lessonTitle = lessonMap.get(row.lesson_id) || 'lesson'
    const sectionTitle = row.section_id ? sectionMap.get(row.section_id) || null : null
    const text = (options.language === 'vi' ? row.text_vi || (options.fallbackToTextEn ? row.text_en : '') : row.text_en) || ''
    return {
      ...row,
      course_title: courseTitle,
      lesson_title: lessonTitle,
      section_title: sectionTitle,
      text,
      target: targetPath(row, options.language, { courseTitle, lessonTitle, sectionTitle }),
    }
  })
}

async function loadNameMap(
  supabase: ReturnType<typeof createClient>,
  table: 'lessons' | 'lesson_sections',
  ids: string[],
): Promise<Map<string, string>> {
  if (ids.length === 0) return new Map()
  const { data, error } = await supabase.from(table).select('id,title').in('id', ids)
  if (error) throw error
  return new Map((data ?? []).map((row: NamedRow) => [row.id, row.title || table]))
}

function unique(values: string[]): string[] {
  return [...new Set(values)]
}

function targetPath(
  row: SentenceResourceRow,
  language: Language,
  names: { courseTitle: string; lessonTitle: string; sectionTitle: string | null },
): string {
  if (language === 'vi' && row.audio_en_url?.startsWith('audio/') && row.audio_en_url.endsWith('.mp3')) {
    return `${row.audio_en_url.slice(0, -4)}.vi.mp3`
  }

  const course = normalizePathPart(names.courseTitle)
  const lesson = normalizePathPart(names.lessonTitle)
  const section = normalizePathPart(names.sectionTitle || 'section')
  const index = String(row.order_index || 0).padStart(4, '0')
  const code = normalizePathPart(row.sentence_code || row.id)
  return `audio/${course}/${lesson}/${section}/${index}_${code}.${language}.mp3`
}

function normalizePathPart(value: string): string {
  return value.replace(/[^A-Za-z0-9]+/g, '_').replace(/^_+|_+$/g, '') || 'item'
}

function speechInput(text: string, language: Language): string {
  let normalized = text.replace(/\s+/g, ' ').trim()
  if (language === 'vi') {
    normalized = normalized
      .replace(/\s*&\s*/g, ' và ')
      .replace(/\s*\/\s*/g, ' hoặc ')
      .replace(/\bUI\s+hoặc\s+UX\b/gi, 'U I hoặc U X')
      .replace(/\bR\s+và\s+D\b/gi, 'R và D')
      .replace(/\bP\s+và\s+G\b/gi, 'P và G')
      .replace(/\s+/g, ' ')
      .trim()
  }
  return normalized
}

async function generateSpeechMp3(args: {
  baseUrl: string
  providerKey: string
  model: string
  text: string
}): Promise<ArrayBuffer> {
  let lastError = 'unknown provider error'
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      const response = await fetch(`${args.baseUrl.replace(/\/+$/, '')}/audio/speech`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${args.providerKey}`,
        },
        body: JSON.stringify({ model: args.model, input: args.text }),
      })

      if (!response.ok) {
        const detail = await response.text().catch(() => '')
        lastError = `TTS provider failed: ${response.status} ${detail.slice(0, 300)}`
      } else {
        const audio = await response.arrayBuffer()
        if (audio.byteLength === 0) {
          lastError = 'TTS provider returned empty audio'
        } else {
          return audio
        }
      }
    } catch (error) {
      lastError = errorMessage(error)
    }

    if (attempt < 3) await sleep(750 * attempt)
  }

  throw new Error(lastError)
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function errorMessage(error: unknown): string {
  if (error instanceof Error) return error.message
  if (typeof error === 'string') return error
  return JSON.stringify(error)
}
