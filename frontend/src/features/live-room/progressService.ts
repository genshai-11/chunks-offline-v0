import type { RealtimeChannel, SupabaseClient } from '@supabase/supabase-js'

import type {
  Learner,
  LearnerProgressSummary,
  LearnerResponse,
  RoomMembership,
  RoomRound,
  UUID,
} from '../../lib/domain/types'
import { mapSupabaseError } from '../../lib/domain/errors'
import { assertSupabaseConfig, supabase as defaultSupabase } from '../../lib/supabase/client'

export interface ProgressMembership extends RoomMembership {
  learner: Learner | null
}

export interface ProgressRound extends Pick<RoomRound, 'id' | 'room_id' | 'round_index' | 'status' | 'sentence_resource_id'> {}

export interface CapturedResponseDetail extends LearnerResponse {
  learner: Learner | null
  round: ProgressRound | null
}

export interface ProgressSummaryRow {
  learner: Learner | null
  membership: ProgressMembership | null
  summary: LearnerProgressSummary
  lastResponse: CapturedResponseDetail | null
}

export interface RoomProgressState {
  summaries: ProgressSummaryRow[]
  responses: CapturedResponseDetail[]
  lastCapturedResponse: CapturedResponseDetail | null
}

export interface ProgressServiceOptions {
  client?: SupabaseClient
}

export interface ProgressSubscriptionOptions extends ProgressServiceOptions {
  roomId: UUID
  onChange: (event: { table: 'room_memberships' | 'room_rounds' | 'learner_responses'; payload: unknown }) => void
  onReconnect?: () => void | Promise<void>
}

export async function loadRoomProgress(
  roomId: UUID,
  { client = defaultSupabase }: ProgressServiceOptions = {},
): Promise<RoomProgressState> {
  assertSupabaseConfig()

  const [membershipsResult, roundsResult] = await Promise.all([
    client.from('room_memberships').select('*, learner:learners(*)').eq('room_id', roomId).order('joined_at'),
    client.from('room_rounds').select('id, room_id, round_index, status, sentence_resource_id').eq('room_id', roomId).order('round_index'),
  ])

  for (const result of [membershipsResult, roundsResult]) {
    if (result.error) throw mapSupabaseError(result.error)
  }

  const memberships = (membershipsResult.data ?? []) as ProgressMembership[]
  const rounds = (roundsResult.data ?? []) as ProgressRound[]
  const roundIds = rounds.map((round) => round.id)

  const responsesResult = roundIds.length
    ? await client
        .from('learner_responses')
        .select('*')
        .in('round_id', roundIds)
        .order('submitted_at', { ascending: false })
    : { data: [], error: null }

  if (responsesResult.error) throw mapSupabaseError(responsesResult.error)

  return buildRoomProgressState({
    memberships,
    responses: (responsesResult.data ?? []) as LearnerResponse[],
    rounds,
  })
}

export function subscribeToProgressUpdates({
  roomId,
  onChange,
  onReconnect,
  client = defaultSupabase,
}: ProgressSubscriptionOptions): RealtimeChannel {
  const channel = client.channel(`room-progress:${roomId}`)

  channel.on(
    'postgres_changes',
    { event: '*', schema: 'public', table: 'room_memberships', filter: `room_id=eq.${roomId}` },
    (payload) => onChange({ table: 'room_memberships', payload }),
  )

  channel.on(
    'postgres_changes',
    { event: '*', schema: 'public', table: 'room_rounds', filter: `room_id=eq.${roomId}` },
    (payload) => onChange({ table: 'room_rounds', payload }),
  )

  // learner_responses does not currently include room_id, so subscribe broadly and let callers refetch scoped progress.
  channel.on(
    'postgres_changes',
    { event: '*', schema: 'public', table: 'learner_responses' },
    (payload) => onChange({ table: 'learner_responses', payload }),
  )

  channel.subscribe((status, error) => {
    if (error) {
      console.error('Supabase progress subscription error', error)
      return
    }

    if (status === 'SUBSCRIBED') {
      void onReconnect?.()
    }
  })

  return channel
}

export async function unsubscribeFromProgressUpdates(
  channel: RealtimeChannel,
  client: SupabaseClient = defaultSupabase,
): Promise<void> {
  await client.removeChannel(channel)
}

export interface BuildProgressInput {
  memberships: ProgressMembership[]
  rounds: ProgressRound[]
  responses: LearnerResponse[]
}

export function buildRoomProgressState({ memberships, rounds, responses }: BuildProgressInput): RoomProgressState {
  const learnerById = new Map<UUID, Learner | null>()
  const membershipByLearnerId = new Map<UUID, ProgressMembership>()
  const roundById = new Map(rounds.map((round) => [round.id, round]))

  for (const membership of memberships) {
    learnerById.set(membership.learner_id, membership.learner)
    membershipByLearnerId.set(membership.learner_id, membership)
  }

  const responseDetails = responses
    .map((response) => ({
      ...response,
      learner: learnerById.get(response.learner_id) ?? null,
      round: roundById.get(response.round_id) ?? null,
    }))
    .sort((a, b) => getTime(b.submitted_at) - getTime(a.submitted_at))

  const responsesByLearner = new Map<UUID, CapturedResponseDetail[]>()
  for (const response of responseDetails) {
    const existing = responsesByLearner.get(response.learner_id) ?? []
    existing.push(response)
    responsesByLearner.set(response.learner_id, existing)
  }

  for (const response of responseDetails) {
    if (!learnerById.has(response.learner_id)) learnerById.set(response.learner_id, response.learner)
  }

  const summaries = Array.from(learnerById.entries())
    .map(([learnerId, learner]) => {
      const learnerResponses = responsesByLearner.get(learnerId) ?? []
      return {
        learner,
        membership: membershipByLearnerId.get(learnerId) ?? null,
        summary: summarizeLearnerResponses(learnerId, learnerResponses),
        lastResponse: learnerResponses[0] ?? null,
      }
    })
    .sort((a, b) => {
      const byLastResponse = getTime(b.summary.last_response_at) - getTime(a.summary.last_response_at)
      if (byLastResponse !== 0) return byLastResponse
      return (a.learner?.display_name ?? '').localeCompare(b.learner?.display_name ?? '')
    })

  return {
    summaries,
    responses: responseDetails,
    lastCapturedResponse: responseDetails[0] ?? null,
  }
}

export function summarizeLearnerResponses(
  learnerId: UUID,
  responses: CapturedResponseDetail[],
): LearnerProgressSummary {
  const responseCount = responses.length
  const totalCpd = roundTo(responses.reduce((total, response) => total + toNumber(response.cpd_result), 0), 4)
  const totalReflectionSeconds = responses.reduce(
    (total, response) => total + toNumber(response.reflection_seconds),
    0,
  )

  return {
    learner_id: learnerId,
    response_count: responseCount,
    red_count: responses.filter((response) => response.response_color === 'red').length,
    yellow_count: responses.filter((response) => response.response_color === 'yellow').length,
    green_count: responses.filter((response) => response.response_color === 'green').length,
    highest_cpd: roundTo(Math.max(0, ...responses.map((response) => toNumber(response.cpd_result))), 4),
    total_cpd: totalCpd,
    average_cpd: responseCount ? roundTo(totalCpd / responseCount, 4) : 0,
    average_reflection_seconds: responseCount ? roundTo(totalReflectionSeconds / responseCount, 3) : 0,
    last_response_at: responses[0]?.submitted_at ?? null,
  }
}

function toNumber(value: number | string | null | undefined): number {
  const numeric = typeof value === 'number' ? value : Number(value ?? 0)
  return Number.isFinite(numeric) ? numeric : 0
}

function getTime(value: string | null | undefined): number {
  return value ? new Date(value).getTime() : 0
}

function roundTo(value: number, decimals: number): number {
  const factor = 10 ** decimals
  return Math.round((value + Number.EPSILON) * factor) / factor
}
