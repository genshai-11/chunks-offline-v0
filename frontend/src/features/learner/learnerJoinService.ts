import type { SupabaseClient } from '@supabase/supabase-js'

import { createDomainError, mapSupabaseError } from '../../lib/domain/errors'
import type { Learner, PracticeRoom, RoomMembership, UUID } from '../../lib/domain/types'
import { assertSupabaseConfig, supabase as defaultSupabase } from '../../lib/supabase/client'

export interface LearnerJoinInput {
  roomCode: string
  displayName: string
}

export interface LearnerJoinResult {
  learner: Learner
  membership: RoomMembership
  room: PracticeRoom
}

export interface LearnerJoinOptions {
  client?: SupabaseClient
}

export async function loadRoomForJoin(
  roomCode: string,
  { client = defaultSupabase }: LearnerJoinOptions = {},
): Promise<PracticeRoom> {
  assertSupabaseConfig()

  const result = await client.from('practice_rooms').select('*').eq('room_code', normalizeRoomCode(roomCode)).maybeSingle()
  if (result.error) throw mapSupabaseError(result.error)
  if (!result.data) throw createDomainError('invalid_room_code')

  const room = result.data as PracticeRoom
  if (room.status === 'finished') throw createDomainError('room_finished')
  return room
}

export async function joinRoom(
  input: LearnerJoinInput,
  { client = defaultSupabase }: LearnerJoinOptions = {},
): Promise<LearnerJoinResult> {
  assertSupabaseConfig()

  const displayName = input.displayName.trim()
  if (!displayName) throw createDomainError('display_name_required')

  const room = await loadRoomForJoin(input.roomCode, { client })
  const authResult = await client.auth.signInAnonymously()
  if (authResult.error) throw mapSupabaseError(authResult.error)

  const authUserId = authResult.data.user?.id
  if (!authUserId) throw new Error('Anonymous sign-in did not return a user ID.')

  const learnerResult = await client
    .from('learners')
    .upsert(
      {
        auth_user_id: authUserId,
        display_name: displayName,
        source: 'anonymous',
        last_seen_at: new Date().toISOString(),
      },
      { onConflict: 'auth_user_id' },
    )
    .select('*')
    .single()

  if (learnerResult.error) throw mapSupabaseError(learnerResult.error)
  const learner = learnerResult.data as Learner

  const membershipResult = await client
    .from('room_memberships')
    .upsert(
      {
        room_id: room.id,
        learner_id: learner.id,
        presence_status: 'online',
        can_answer: false,
      },
      { onConflict: 'room_id,learner_id' },
    )
    .select('*')
    .single()

  if (membershipResult.error) throw mapSupabaseError(membershipResult.error)

  return {
    learner,
    membership: membershipResult.data as RoomMembership,
    room,
  }
}

export function normalizeRoomCode(roomCode: string): string {
  return roomCode.trim().toUpperCase()
}

export function getStoredLearnerId(roomCode: string): UUID | null {
  try {
    return window.localStorage.getItem(`chunks-learner:${normalizeRoomCode(roomCode)}`)
  } catch {
    return null
  }
}

export function storeLearnerId(roomCode: string, learnerId: UUID): void {
  try {
    window.localStorage.setItem(`chunks-learner:${normalizeRoomCode(roomCode)}`, learnerId)
  } catch {
    // Storage is a convenience only; durable membership remains in Supabase.
  }
}
