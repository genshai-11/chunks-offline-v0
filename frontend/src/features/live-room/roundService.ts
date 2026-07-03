import type { SupabaseClient } from '@supabase/supabase-js'

import type {
  CciStandardCard,
  Learner,
  PracticeRoom,
  ResponseCaptureMode,
  RoomMembership,
  RoomRound,
  ScoringMode,
  SentenceResource,
  UUID,
} from '../../lib/domain/types'
import { mapSupabaseError } from '../../lib/domain/errors'
import { assertSupabaseConfig, supabase as defaultSupabase } from '../../lib/supabase/client'

export interface TeacherRoomState {
  room: PracticeRoom
  roster: TeacherRosterMember[]
  currentRound: RoomRound | null
  currentSentence: SentenceResource | null
  availableSentences: SentenceResource[]
  cciCards: CciStandardCard[]
}

export interface TeacherRosterMember extends RoomMembership {
  learner: Learner | null
}

export interface RoundServiceOptions {
  client?: SupabaseClient
}

export interface OpenRoundInput {
  roomId: UUID
  sentenceResourceId: UUID
  assignedLearnerId: UUID | null
  cciStandardCardId: UUID
  captureMode: ResponseCaptureMode
  scoringMode: ScoringMode
  openedBy?: string
}

export async function loadTeacherRoomState(
  roomCode: string,
  { client = defaultSupabase }: RoundServiceOptions = {},
): Promise<TeacherRoomState> {
  assertSupabaseConfig()

  const roomResult = await client.from('practice_rooms').select('*').eq('room_code', roomCode).maybeSingle()
  if (roomResult.error) throw mapSupabaseError(roomResult.error)
  if (!roomResult.data) throw new Error(`Room ${roomCode} was not found.`)

  const room = roomResult.data as PracticeRoom
  const [rosterResult, roundsResult, cciCardsResult, resourcesResult] = await Promise.all([
    client.from('room_memberships').select('*, learner:learners(*)').eq('room_id', room.id).order('joined_at'),
    client.from('room_rounds').select('*').eq('room_id', room.id).order('round_index', { ascending: false }).limit(1),
    client.from('cci_standard_cards').select('*').eq('active', true).order('label'),
    client
      .from('sentence_resources')
      .select('*')
      .in('id', room.snapshot_sentence_resource_ids.length ? room.snapshot_sentence_resource_ids : ['00000000-0000-0000-0000-000000000000'])
      .order('order_index'),
  ])

  for (const result of [rosterResult, roundsResult, cciCardsResult, resourcesResult]) {
    if (result.error) throw mapSupabaseError(result.error)
  }

  const currentRound = ((roundsResult.data ?? [])[0] ?? null) as RoomRound | null
  const availableSentences = (resourcesResult.data ?? []) as SentenceResource[]
  const currentSentence = currentRound
    ? availableSentences.find((sentence) => sentence.id === currentRound.sentence_resource_id) ?? null
    : null

  return {
    room,
    roster: (rosterResult.data ?? []) as TeacherRosterMember[],
    currentRound,
    currentSentence,
    availableSentences,
    cciCards: (cciCardsResult.data ?? []) as CciStandardCard[],
  }
}

export async function openRound(
  input: OpenRoundInput,
  { client = defaultSupabase }: RoundServiceOptions = {},
): Promise<RoomRound> {
  assertSupabaseConfig()

  const roomResult = await client.from('practice_rooms').select('*').eq('id', input.roomId).single()
  if (roomResult.error) throw mapSupabaseError(roomResult.error)
  const room = roomResult.data as PracticeRoom

  if (room.status === 'finished') throw new Error('Cannot open a round for a finished room.')
  if (input.captureMode === 'assigned' && !input.assignedLearnerId) {
    throw new Error('Assigned mode requires an active learner before opening the round.')
  }

  const existingOpenResult = await client
    .from('room_rounds')
    .select('id')
    .eq('room_id', input.roomId)
    .eq('status', 'open')
    .maybeSingle()
  if (existingOpenResult.error) throw mapSupabaseError(existingOpenResult.error)
  if (existingOpenResult.data) throw new Error('Another round is already open.')

  const [sentenceResult, cciResult, previousRoundResult] = await Promise.all([
    client.from('sentence_resources').select('*').eq('id', input.sentenceResourceId).eq('approval_status', 'approved').single(),
    client.from('cci_standard_cards').select('*').eq('id', input.cciStandardCardId).eq('active', true).single(),
    client.from('room_rounds').select('round_index').eq('room_id', input.roomId).order('round_index', { ascending: false }).limit(1),
  ])

  for (const result of [sentenceResult, cciResult, previousRoundResult]) {
    if (result.error) throw mapSupabaseError(result.error)
  }

  const sentence = sentenceResult.data as SentenceResource
  const cciCard = cciResult.data as CciStandardCard
  const previousRound = (previousRoundResult.data ?? [])[0] as Pick<RoomRound, 'round_index'> | undefined
  const roundIndex = previousRound ? previousRound.round_index + 1 : 1

  const roundResult = await client
    .from('room_rounds')
    .insert({
      room_id: input.roomId,
      sentence_resource_id: sentence.id,
      assigned_learner_id: input.assignedLearnerId,
      cci_standard_card_id: cciCard.id,
      cci_standard_x: cciCard.standard_value,
      cvr_value: sentence.cvr_value ?? sentence.default_cvr_value ?? 1,
      round_index: roundIndex,
      status: 'open',
      response_capture_mode_snapshot: input.captureMode,
      scoring_mode_snapshot: input.scoringMode,
      opened_by: input.openedBy ?? 'Teacher Host',
      sequence_key: `${room.room_code}-${roundIndex}`,
      opened_at: new Date().toISOString(),
    })
    .select('*')
    .single()

  if (roundResult.error) throw mapSupabaseError(roundResult.error)

  const round = roundResult.data as RoomRound
  const updateRoomResult = await client
    .from('practice_rooms')
    .update({ status: 'round_open', current_round_id: round.id })
    .eq('id', input.roomId)

  if (updateRoomResult.error) throw mapSupabaseError(updateRoomResult.error)

  return round
}

export async function closeRound(roundId: UUID, { client = defaultSupabase }: RoundServiceOptions = {}): Promise<void> {
  assertSupabaseConfig()

  const roundResult = await client.from('room_rounds').select('*').eq('id', roundId).single()
  if (roundResult.error) throw mapSupabaseError(roundResult.error)
  const round = roundResult.data as RoomRound

  const [closeResult, roomResult] = await Promise.all([
    client.from('room_rounds').update({ status: 'closed', closed_at: new Date().toISOString() }).eq('id', roundId),
    client.from('practice_rooms').update({ status: 'round_closed' }).eq('id', round.room_id),
  ])

  if (closeResult.error) throw mapSupabaseError(closeResult.error)
  if (roomResult.error) throw mapSupabaseError(roomResult.error)
}

export async function advanceRound(
  state: TeacherRoomState,
  input: Omit<OpenRoundInput, 'roomId' | 'sentenceResourceId'>,
  options: RoundServiceOptions = {},
): Promise<RoomRound> {
  const nextSentence = getNextSentence(state)
  if (!nextSentence) throw new Error('No next sentence is available for this room.')

  if (state.currentRound?.status === 'open') {
    await closeRound(state.currentRound.id, options)
  }

  return openRound(
    {
      ...input,
      roomId: state.room.id,
      sentenceResourceId: nextSentence.id,
    },
    options,
  )
}

export async function finishRoom(roomId: UUID, { client = defaultSupabase }: RoundServiceOptions = {}): Promise<void> {
  assertSupabaseConfig()

  const result = await client.from('practice_rooms').update({ status: 'finished' }).eq('id', roomId)
  if (result.error) throw mapSupabaseError(result.error)
}

export function getNextSentence(state: TeacherRoomState): SentenceResource | null {
  if (!state.currentRound) return state.availableSentences[0] ?? null

  const currentIndex = state.availableSentences.findIndex(
    (sentence) => sentence.id === state.currentRound?.sentence_resource_id,
  )
  return state.availableSentences[currentIndex + 1] ?? null
}
