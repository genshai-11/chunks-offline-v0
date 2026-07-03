import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { Learner, PracticeRoom, RoomMembership } from '../../src/lib/domain/types'
import { LearnerJoinPage } from '../../src/features/learner/LearnerJoinPage'
import { joinRoom, loadRoomForJoin } from '../../src/features/learner/learnerJoinService'
import { loadLearnerRoomState } from '../../src/features/learner/responseService'

vi.mock('../../src/features/learner/learnerJoinService', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../src/features/learner/learnerJoinService')>()
  return {
    ...actual,
    getStoredLearnerId: vi.fn(() => null),
    joinRoom: vi.fn(),
    loadRoomForJoin: vi.fn(),
    storeLearnerId: vi.fn(),
  }
})

vi.mock('../../src/features/learner/responseService', () => ({
  loadLearnerRoomState: vi.fn(),
  submitLearnerResponse: vi.fn(),
}))

const room: PracticeRoom = {
  id: 'room-1',
  room_code: 'ABC123',
  title: 'Demo Room',
  status: 'round_open',
  current_round_id: 'round-1',
  course_id: 'course-1',
  lesson_id: 'lesson-1',
  host_name: 'Teacher Host',
  resource_scope_filter: {},
  snapshot_sentence_resource_ids: ['sentence-1'],
  scope_refreshed_at: null,
  scoring_mode: 'simple',
  default_response_capture_mode: 'assigned',
  teacher_pin_hash: null,
  created_at: '',
  updated_at: '',
}

const learner: Learner = {
  id: 'learner-1',
  auth_user_id: 'auth-1',
  display_name: 'Lucy Learner',
  source: 'anonymous',
  last_seen_at: '',
  created_at: '',
  updated_at: '',
}

const membership: RoomMembership = {
  id: 'membership-1',
  room_id: 'room-1',
  learner_id: 'learner-1',
  presence_status: 'online',
  can_answer: false,
  joined_at: '',
  updated_at: '',
}

describe('LearnerJoinPage', () => {
  beforeEach(() => {
    window.localStorage.clear()
    vi.mocked(loadRoomForJoin).mockResolvedValue(room)
    vi.mocked(joinRoom).mockResolvedValue({ learner, membership, room })
    vi.mocked(loadLearnerRoomState).mockResolvedValue({
      room,
      membership,
      currentRound: {
        id: 'round-1',
        room_id: 'room-1',
        sentence_resource_id: 'sentence-1',
        assigned_learner_id: 'learner-1',
        captured_learner_id: null,
        cci_standard_card_id: 'cci-1',
        cci_standard_x: 1.25,
        cvr_value: 12,
        round_index: 1,
        status: 'open',
        response_capture_mode_snapshot: 'assigned',
        scoring_mode_snapshot: 'simple',
        opened_by: 'Teacher Host',
        sequence_key: 'ABC123-1',
        opened_at: new Date().toISOString(),
        closed_at: null,
        created_at: '',
        updated_at: '',
      },
      currentSentence: {
        id: 'sentence-1',
        course_id: 'course-1',
        lesson_id: 'lesson-1',
        section_id: 'section-1',
        sentence_code: 'S001',
        text_prompt: null,
        text_en: 'I can answer this sentence.',
        text_vi: 'Tôi có thể trả lời câu này.',
        audio_url: null,
        audio_en_url: null,
        audio_vi_url: null,
        audio_variants: {},
        default_cvr_unit_id: null,
        default_cvr_value: 1,
        cvr_value: 12,
        order_index: 1,
        approval_status: 'approved',
        created_at: '',
        updated_at: '',
      },
      existingResponse: null,
      learnerState: 'assigned',
      disabledReason: null,
    })
  })

  it('joins by display name and renders learner response room', async () => {
    const user = userEvent.setup()
    render(<LearnerJoinPage roomCode="ABC123" />)

    expect(await screen.findByRole('heading', { name: /demo room/i })).toBeInTheDocument()
    await user.type(screen.getByLabelText(/display name/i), 'Lucy Learner')
    await user.click(screen.getByRole('button', { name: /join room/i }))

    await waitFor(() => {
      expect(joinRoom).toHaveBeenCalledWith({ roomCode: 'ABC123', displayName: 'Lucy Learner' })
    })
    expect(await screen.findByText('I can answer this sentence.')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /green/i })).toBeEnabled()
  })
})
