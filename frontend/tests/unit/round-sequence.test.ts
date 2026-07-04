import { describe, expect, it } from 'vitest'

import {
  chooseAutoRotateLearner,
  computeFilteredSnapshotSentenceIds,
  getUnplayedSentences,
  resolveAssignedLearnerId,
  type TeacherRoomState,
  type TeacherRosterMember,
} from '../../src/features/live-room/roundService'
import type { RoomRound, SentenceResource } from '../../src/lib/domain/types'

describe('round sequence helpers', () => {
  it('filters only unplayed resources while preserving played snapshot order', () => {
    const state = makeTeacherState({
      sentenceCount: 5,
      rounds: [makeRound(1, 'sentence-1', 'learner-1'), makeRound(2, 'sentence-2', 'learner-2')],
    })

    expect(getUnplayedSentences(state).map((sentence) => sentence.id)).toEqual(['sentence-3', 'sentence-4', 'sentence-5'])
    expect(computeFilteredSnapshotSentenceIds(state, ['sentence-4'])).toEqual(['sentence-1', 'sentence-2', 'sentence-4'])
    expect(() => computeFilteredSnapshotSentenceIds(state, ['sentence-2'])).toThrow(/Only unplayed upcoming resources/i)
  })

  it('auto-rotates 100 resources evenly across 5 eligible learners', () => {
    const roster = makeRoster(5)
    const rounds: RoomRound[] = []

    for (let index = 1; index <= 100; index += 1) {
      const learnerId = chooseAutoRotateLearner(roster, rounds)
      expect(learnerId).toBeTruthy()
      rounds.push(makeRound(index, `sentence-${index}`, learnerId))
    }

    const counts = new Map<string, number>()
    for (const round of rounds) {
      counts.set(round.assigned_learner_id!, (counts.get(round.assigned_learner_id!) ?? 0) + 1)
    }

    expect([...counts.entries()].sort()).toEqual([
      ['learner-1', 20],
      ['learner-2', 20],
      ['learner-3', 20],
      ['learner-4', 20],
      ['learner-5', 20],
    ])
  })

  it('resolves assigned, auto-rotate, and first-responder learner targets', () => {
    const roster = makeRoster(2)
    const rounds = [makeRound(1, 'sentence-1', 'learner-1')]

    expect(resolveAssignedLearnerId({ captureMode: 'assigned', selectedLearnerId: 'learner-2', roster, rounds })).toBe(
      'learner-2',
    )
    expect(resolveAssignedLearnerId({ captureMode: 'auto_rotate', selectedLearnerId: null, roster, rounds })).toBe(
      'learner-2',
    )
    expect(resolveAssignedLearnerId({ captureMode: 'first_responder', selectedLearnerId: 'learner-2', roster, rounds })).toBe(
      null,
    )
  })
})

function makeTeacherState({ sentenceCount, rounds }: { sentenceCount: number; rounds: RoomRound[] }): TeacherRoomState {
  const availableSentences = Array.from({ length: sentenceCount }, (_, index) => makeSentence(index + 1))

  return {
    room: {
      id: 'room-1',
      room_code: 'ABC123',
      title: 'Round Sequence Room',
      status: rounds.at(-1)?.status === 'open' ? 'round_open' : 'round_closed',
      current_round_id: rounds.at(-1)?.id ?? null,
      course_id: 'course-1',
      lesson_id: 'lesson-1',
      host_name: 'Teacher Host',
      resource_scope_filter: {},
      snapshot_sentence_resource_ids: availableSentences.map((sentence) => sentence.id),
      scope_refreshed_at: null,
      scoring_mode: 'simple',
      default_response_capture_mode: 'auto_rotate',
      teacher_pin_hash: null,
      created_at: '',
      updated_at: '',
    },
    roster: makeRoster(5),
    rounds,
    currentRound: rounds.at(-1) ?? null,
    currentSentence: availableSentences.find((sentence) => sentence.id === rounds.at(-1)?.sentence_resource_id) ?? null,
    availableSentences,
    cciCards: [],
  }
}

function makeRoster(count: number): TeacherRosterMember[] {
  return Array.from({ length: count }, (_, index) => {
    const learnerId = `learner-${index + 1}`
    return {
      id: `membership-${index + 1}`,
      room_id: 'room-1',
      learner_id: learnerId,
      presence_status: 'online',
      can_answer: true,
      joined_at: '',
      updated_at: '',
      learner: {
        id: learnerId,
        auth_user_id: null,
        display_name: `Learner ${index + 1}`,
        source: 'anonymous',
        last_seen_at: '',
        created_at: '',
        updated_at: '',
      },
    }
  })
}

function makeRound(roundIndex: number, sentenceResourceId: string, assignedLearnerId: string | null): RoomRound {
  return {
    id: `round-${roundIndex}`,
    room_id: 'room-1',
    sentence_resource_id: sentenceResourceId,
    assigned_learner_id: assignedLearnerId,
    captured_learner_id: assignedLearnerId,
    cci_standard_card_id: 'cci-1',
    cci_standard_x: 10,
    cvr_value: 2,
    round_index: roundIndex,
    status: 'closed',
    response_capture_mode_snapshot: 'auto_rotate',
    scoring_mode_snapshot: 'simple',
    opened_by: 'Teacher Host',
    sequence_key: `ABC123-${roundIndex}`,
    opened_at: '',
    closed_at: '',
    created_at: '',
    updated_at: '',
  }
}

function makeSentence(index: number): SentenceResource {
  return {
    id: `sentence-${index}`,
    course_id: 'course-1',
    lesson_id: 'lesson-1',
    section_id: 'section-1',
    sentence_code: `S${String(index).padStart(3, '0')}`,
    text_prompt: null,
    text_en: `Sentence ${index}`,
    text_vi: null,
    audio_url: null,
    audio_en_url: null,
    audio_vi_url: null,
    audio_variants: {},
    default_cvr_unit_id: null,
    default_cvr_value: 1,
    cvr_value: 1,
    order_index: index,
    approval_status: 'approved',
    created_at: '',
    updated_at: '',
  }
}
