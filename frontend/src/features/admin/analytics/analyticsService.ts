import type { SupabaseClient } from '@supabase/supabase-js'

import { mapSupabaseError } from '../../../lib/domain/errors'
import type { Learner, LearnerResponse, PracticeRoom, RoomMembership, RoomRound } from '../../../lib/domain/types'
import { assertSupabaseConfig, supabase as defaultSupabase } from '../../../lib/supabase/client'

export interface AdminRoomAnalyticsRow {
  averageCpd: number
  completedRounds: number
  responseCount: number
  roomCode: string
  title: string
  totalCpd: number
}

export interface AdminLearnerAnalyticsRow {
  averageReflectionSeconds: number
  greenCount: number
  learnerName: string
  purpleCount: number
  redCount: number
  responseCount: number
  totalCpd: number
  yellowCount: number
}

export interface AdminAnalyticsTotals {
  averageReflectionSeconds: number
  responseCount: number
  totalCpd: number
}

export interface AdminSessionAnalytics {
  learners: AdminLearnerAnalyticsRow[]
  rooms: AdminRoomAnalyticsRow[]
  totals: AdminAnalyticsTotals
}

export interface AnalyticsServiceOptions {
  client?: SupabaseClient
}

interface MembershipWithLearner extends RoomMembership {
  learner: Learner | null
}

export async function loadSessionAnalytics({
  client = defaultSupabase,
}: AnalyticsServiceOptions = {}): Promise<AdminSessionAnalytics> {
  assertSupabaseConfig()

  const [roomsResult, roundsResult, membershipsResult] = await Promise.all([
    client.from('practice_rooms').select('*').order('created_at', { ascending: false }).limit(20),
    client.from('room_rounds').select('*').order('created_at', { ascending: false }).limit(300),
    client.from('room_memberships').select('*, learner:learners(*)').order('joined_at', { ascending: false }).limit(300),
  ])

  for (const result of [roomsResult, roundsResult, membershipsResult]) {
    if (result.error) throw mapSupabaseError(result.error)
  }

  const rooms = (roomsResult.data ?? []) as PracticeRoom[]
  const rounds = (roundsResult.data ?? []) as RoomRound[]
  const memberships = (membershipsResult.data ?? []) as MembershipWithLearner[]
  const roundIds = rounds.map((round) => round.id)

  const responsesResult = roundIds.length
    ? await client.from('learner_responses').select('*').in('round_id', roundIds).order('submitted_at', { ascending: false })
    : { data: [], error: null }

  if (responsesResult.error) throw mapSupabaseError(responsesResult.error)

  return buildSessionAnalytics({
    memberships,
    responses: (responsesResult.data ?? []) as LearnerResponse[],
    rooms,
    rounds,
  })
}

export function buildSessionAnalytics({
  memberships,
  responses,
  rooms,
  rounds,
}: {
  memberships: MembershipWithLearner[]
  responses: LearnerResponse[]
  rooms: PracticeRoom[]
  rounds: RoomRound[]
}): AdminSessionAnalytics {
  const roomById = new Map(rooms.map((room) => [room.id, room]))
  const roundById = new Map(rounds.map((round) => [round.id, round]))
  const learnerNameById = new Map(memberships.map((membership) => [membership.learner_id, membership.learner?.display_name ?? 'Unnamed learner']))

  const responsesByRoom = new Map<string, LearnerResponse[]>()
  for (const response of responses) {
    const roomId = roundById.get(response.round_id)?.room_id
    if (!roomId) continue
    const existing = responsesByRoom.get(roomId) ?? []
    existing.push(response)
    responsesByRoom.set(roomId, existing)
  }

  const roomsSummary = rooms.map((room) => {
    const roomResponses = responsesByRoom.get(room.id) ?? []
    const completedRounds = rounds.filter((round) => round.room_id === room.id && round.status === 'closed').length
    const totalCpd = sum(roomResponses.map((response) => toNumber(response.cpd_result)))
    return {
      averageCpd: roomResponses.length ? roundTo(totalCpd / roomResponses.length, 2) : 0,
      completedRounds,
      responseCount: roomResponses.length,
      roomCode: room.room_code,
      title: room.title,
      totalCpd: roundTo(totalCpd, 2),
    }
  })

  const responsesByLearner = new Map<string, LearnerResponse[]>()
  for (const response of responses) {
    const existing = responsesByLearner.get(response.learner_id) ?? []
    existing.push(response)
    responsesByLearner.set(response.learner_id, existing)
  }

  const learners = Array.from(responsesByLearner.entries()).map(([learnerId, learnerResponses]) => {
    const totalCpd = sum(learnerResponses.map((response) => toNumber(response.cpd_result)))
    const totalReflection = sum(learnerResponses.map((response) => toNumber(response.reflection_seconds)))
    return {
      averageReflectionSeconds: learnerResponses.length ? roundTo(totalReflection / learnerResponses.length, 2) : 0,
      greenCount: learnerResponses.filter((response) => response.response_color === 'green').length,
      learnerName: learnerNameById.get(learnerId) ?? 'Unknown learner',
      purpleCount: learnerResponses.filter((response) => response.response_color === 'purple').length,
      redCount: learnerResponses.filter((response) => response.response_color === 'red').length,
      responseCount: learnerResponses.length,
      totalCpd: roundTo(totalCpd, 2),
      yellowCount: learnerResponses.filter((response) => response.response_color === 'yellow').length,
    }
  })

  const totalCpd = sum(responses.map((response) => toNumber(response.cpd_result)))
  const totalReflection = sum(responses.map((response) => toNumber(response.reflection_seconds)))

  return {
    learners,
    rooms: roomsSummary,
    totals: {
      averageReflectionSeconds: responses.length ? roundTo(totalReflection / responses.length, 2) : 0,
      responseCount: responses.length,
      totalCpd: roundTo(totalCpd, 2),
    },
  }
}

function sum(values: number[]): number {
  return values.reduce((total, value) => total + value, 0)
}

function toNumber(value: number | string | null | undefined): number {
  const numeric = typeof value === 'number' ? value : Number(value ?? 0)
  return Number.isFinite(numeric) ? numeric : 0
}

function roundTo(value: number, decimals: number): number {
  const factor = 10 ** decimals
  return Math.round((value + Number.EPSILON) * factor) / factor
}
