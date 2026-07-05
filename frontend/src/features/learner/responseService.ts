import type { SupabaseClient } from '@supabase/supabase-js'

import { createDomainError, mapSupabaseError } from '../../lib/domain/errors'
import type {
  LearnerResponse,
  LearnerState,
  PracticeRoom,
  ResponseCaptureMode,
  ResponseColor,
  RoomMembership,
  RoomRound,
  SentenceResource,
  UUID,
} from '../../lib/domain/types'
import { calculateSimpleScore } from '../../lib/scoring/simpleScoring'
import { assertSupabaseConfig, supabase as defaultSupabase } from '../../lib/supabase/client'
import { normalizeRoomCode } from './learnerJoinService'

export interface LearnerRoomStateResult {
  room: PracticeRoom
  membership: RoomMembership | null
  currentRound: RoomRound | null
  currentSentence: SentenceResource | null
  existingResponse: LearnerResponse | null
  roundHasCapturedResponse: boolean
  learnerState: LearnerState
  disabledReason: string | null
}

export interface LearnerRoomOptions {
  client?: SupabaseClient
}

export interface SubmitResponseInput {
  learnerId: UUID
  responseColor: ResponseColor
  roundId: UUID
  openedAt: string | null
}

export async function loadLearnerRoomState(
  roomCode: string,
  learnerId: UUID | null,
  { client = defaultSupabase }: LearnerRoomOptions = {},
): Promise<LearnerRoomStateResult> {
  assertSupabaseConfig()

  const roomResult = await client.from('practice_rooms').select('*').eq('room_code', normalizeRoomCode(roomCode)).maybeSingle()
  if (roomResult.error) throw mapSupabaseError(roomResult.error)
  if (!roomResult.data) throw createDomainError('invalid_room_code')

  const room = roomResult.data as PracticeRoom
  const [membershipResult, roundResult] = await Promise.all([
    learnerId
      ? client.from('room_memberships').select('*').eq('room_id', room.id).eq('learner_id', learnerId).maybeSingle()
      : Promise.resolve({ data: null, error: null }),
    room.current_round_id
      ? client.from('room_rounds').select('*').eq('id', room.current_round_id).maybeSingle()
      : client.from('room_rounds').select('*').eq('room_id', room.id).order('round_index', { ascending: false }).limit(1).maybeSingle(),
  ])

  if (membershipResult.error) throw mapSupabaseError(membershipResult.error)
  if (roundResult.error) throw mapSupabaseError(roundResult.error)

  const membership = (membershipResult.data ?? null) as RoomMembership | null
  const currentRound = (roundResult.data ?? null) as RoomRound | null

  const [sentenceResult, responseResult, capturedResponseResult] = await Promise.all([
    currentRound
      ? client.from('sentence_resources').select('*').eq('id', currentRound.sentence_resource_id).maybeSingle()
      : Promise.resolve({ data: null, error: null }),
    currentRound && learnerId
      ? client.from('learner_responses').select('*').eq('round_id', currentRound.id).eq('learner_id', learnerId).maybeSingle()
      : Promise.resolve({ data: null, error: null }),
    currentRound
      ? client.from('learner_responses').select('id').eq('round_id', currentRound.id).maybeSingle()
      : Promise.resolve({ data: null, error: null }),
  ])

  if (sentenceResult.error) throw mapSupabaseError(sentenceResult.error)
  if (responseResult.error) throw mapSupabaseError(responseResult.error)
  if (capturedResponseResult.error) throw mapSupabaseError(capturedResponseResult.error)

  const existingResponse = (responseResult.data ?? null) as LearnerResponse | null
  const currentSentence = (sentenceResult.data ?? null) as SentenceResource | null
  const roundHasCapturedResponse = Boolean(currentRound?.captured_learner_id || capturedResponseResult.data)
  const { learnerState, disabledReason } = deriveLearnerState({ currentRound, existingResponse, learnerId, membership, room, roundHasCapturedResponse })

  return {
    room,
    membership,
    currentRound,
    currentSentence,
    existingResponse,
    roundHasCapturedResponse,
    learnerState,
    disabledReason,
  }
}

export async function submitLearnerResponse(
  input: SubmitResponseInput,
  { client = defaultSupabase }: LearnerRoomOptions = {},
): Promise<LearnerResponse> {
  assertSupabaseConfig()

  const roundResult = await client.from('room_rounds').select('*').eq('id', input.roundId).single()
  if (roundResult.error) throw mapSupabaseError(roundResult.error)
  const round = roundResult.data as RoomRound

  if (round.status !== 'open') throw createDomainError('round_not_open')

  const roomResult = await client.from('practice_rooms').select('default_response_capture_mode').eq('id', round.room_id).maybeSingle()
  if (roomResult.error) throw mapSupabaseError(roomResult.error)

  const effectiveCaptureMode = resolveEffectiveResponseCaptureMode(
    round.response_capture_mode_snapshot,
    (roomResult.data as Pick<PracticeRoom, 'default_response_capture_mode'> | null)?.default_response_capture_mode,
  )
  if (effectiveCaptureMode !== 'first_responder' && round.assigned_learner_id !== input.learnerId) {
    throw createDomainError('learner_not_eligible')
  }

  const existingResult = await client.from('learner_responses').select('id').eq('round_id', round.id).maybeSingle()
  if (existingResult.error) throw mapSupabaseError(existingResult.error)
  if (existingResult.data) throw createDomainError('duplicate_response')

  const openedAt = input.openedAt ? new Date(input.openedAt).getTime() : Date.now()
  const reflectionTimeMs = Math.max(0, Date.now() - openedAt)
  const score = calculateSimpleScore({
    responseColor: input.responseColor,
    cciStandardX: round.cci_standard_x,
    cvrValue: round.cvr_value,
    reflectionTimeMs,
  })

  const insertResult = await client
    .from('learner_responses')
    .insert({
      round_id: round.id,
      learner_id: input.learnerId,
      response_color: input.responseColor,
      performance_y: score.learnerPerformanceY,
      reflection_time_ms: score.reflectionTimeMs,
      reflection_seconds: score.reflectionSeconds,
      cci_standard_x: score.cciStandardX,
      cvr_value: score.cvrValue,
      cci_result: score.cciResult,
      cpd_result: score.cpdResult,
      finalized: true,
      scoring_mode_snapshot: score.scoringModeSnapshot,
      response_capture_mode_snapshot: round.response_capture_mode_snapshot,
      formula_version_snapshot: score.formulaVersionSnapshot,
    })
    .select('*')
    .single()

  if (insertResult.error) throw mapSupabaseError(insertResult.error)

  const updateRoundResult = await client.from('room_rounds').update({ captured_learner_id: input.learnerId }).eq('id', round.id)
  if (updateRoundResult.error) throw mapSupabaseError(updateRoundResult.error)

  return insertResult.data as LearnerResponse
}

function deriveLearnerState({
  currentRound,
  existingResponse,
  learnerId,
  membership,
  room,
  roundHasCapturedResponse,
}: {
  currentRound: RoomRound | null
  existingResponse: LearnerResponse | null
  learnerId: UUID | null
  membership: RoomMembership | null
  room: PracticeRoom
  roundHasCapturedResponse: boolean
}): { learnerState: LearnerState; disabledReason: string | null } {
  if (!learnerId || !membership) return { learnerState: 'waiting', disabledReason: 'Join this room before responding.' }
  if (room.status === 'finished') return { learnerState: 'round_closed', disabledReason: 'This room has finished.' }
  if (!currentRound || currentRound.status !== 'open') {
    return { learnerState: 'round_closed', disabledReason: 'The teacher has not opened a response window.' }
  }
  if (existingResponse) return { learnerState: 'already_responded', disabledReason: 'Your response was already captured.' }
  if (roundHasCapturedResponse) {
    return { learnerState: 'observing', disabledReason: 'A response has already been captured for this round.' }
  }
  const effectiveCaptureMode = resolveEffectiveResponseCaptureMode(currentRound.response_capture_mode_snapshot, room.default_response_capture_mode)
  if (effectiveCaptureMode !== 'first_responder' && currentRound.assigned_learner_id !== learnerId) {
    return { learnerState: 'observing', disabledReason: 'You are observing this assigned round.' }
  }
  return { learnerState: 'assigned', disabledReason: null }
}

export function resolveEffectiveResponseCaptureMode(roundMode: unknown, roomMode: unknown): ResponseCaptureMode {
  if (isResponseCaptureMode(roundMode)) return roundMode
  if (isResponseCaptureMode(roomMode)) return roomMode
  return 'assigned'
}

function isResponseCaptureMode(value: unknown): value is ResponseCaptureMode {
  return value === 'assigned' || value === 'first_responder' || value === 'auto_rotate'
}
