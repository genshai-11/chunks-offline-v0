import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { TeacherRoomPage } from '../../src/features/teacher/TeacherRoomPage'
import { LearnerRoomPage } from '../../src/features/learner/LearnerRoomPage'
import { advanceRound, loadTeacherRoomState, updateRoomResourceFilter } from '../../src/features/live-room/roundService'
import { loadLearnerRoomState } from '../../src/features/learner/responseService'
import { loadRoomProgress } from '../../src/features/live-room/progressService'
import type { LearnerResponse, SentenceResource } from '../../src/lib/domain/types'

vi.mock('../../src/lib/supabase/realtime', () => ({
  subscribeToRoomState: vi.fn(() => ({ topic: 'room' })),
  unsubscribeFromRoomState: vi.fn(),
}))

vi.mock('../../src/features/live-room/progressService', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../src/features/live-room/progressService')>()
  return {
    ...actual,
    loadRoomProgress: vi.fn(),
    subscribeToProgressUpdates: vi.fn(() => ({ topic: 'progress' })),
    unsubscribeFromProgressUpdates: vi.fn(),
  }
})

vi.mock('../../src/features/live-room/roundService', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../src/features/live-room/roundService')>()
  return {
    ...actual,
    advanceRound: vi.fn(async () => ({ id: 'round-2' })),
    closeRound: vi.fn(),
    finishRoom: vi.fn(),
    loadTeacherRoomState: vi.fn(),
    openRound: vi.fn(),
    updateRoomResourceFilter: vi.fn(async () => ['sentence-1', 'sentence-2']),
  }
})

vi.mock('../../src/features/learner/responseService', () => ({
  loadLearnerRoomState: vi.fn(),
  submitLearnerResponse: vi.fn(),
}))

class FakeAudio {
  static instances: FakeAudio[] = []
  currentTime = 0
  ended = false
  paused = true
  playbackRate = 1
  preload = ''
  pause = vi.fn(() => {
    this.paused = true
  })
  play = vi.fn(async () => {
    this.paused = false
  })

  constructor(public src: string) {
    FakeAudio.instances.push(this)
  }
}

const sentences: SentenceResource[] = [
  makeSentence('sentence-1', 'S001', 'Teacher detail one', 'vi one', 'en-1.mp3', 'vi-1.mp3', 1),
  makeSentence('sentence-2', 'S002', 'Teacher detail two', 'vi two', 'en-2.mp3', null, 2),
  makeSentence('sentence-3', 'S003', 'Teacher detail three', 'vi three', null, 'vi-3.mp3', 3),
]

const capturedResponse: LearnerResponse = {
  id: 'response-1',
  round_id: 'round-1',
  learner_id: 'learner-1',
  performance_y: 2,
  response_color: 'green',
  cci_standard_x: 10,
  cvr_value: 2,
  cci_result: 20,
  cpd_result: 40,
  reflection_time_ms: 1000,
  reflection_seconds: 1,
  finalized: true,
  scoring_mode_snapshot: 'simple',
  response_capture_mode_snapshot: 'assigned',
  submitted_at: '2026-07-03T15:00:00.000Z',
  updated_at: '2026-07-03T15:00:00.000Z',
}

describe('room session playback refinement', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.stubGlobal('Audio', FakeAudio)
    FakeAudio.instances = []
    vi.mocked(loadRoomProgress).mockResolvedValue({
      summaries: [],
      responses: [{ ...capturedResponse, learner: null, round: null }],
      lastCapturedResponse: null,
    })
    vi.mocked(loadTeacherRoomState).mockResolvedValue({
      room: {
        id: 'room-1',
        room_code: 'ABC123',
        title: 'Playback Room',
        status: 'round_open',
        current_round_id: 'round-1',
        course_id: 'course-1',
        lesson_id: 'lesson-1',
        host_name: 'Teacher Host',
        resource_scope_filter: { cci_standard_card_id: 'cci-1' },
        snapshot_sentence_resource_ids: sentences.map((sentence) => sentence.id),
        scope_refreshed_at: null,
        scoring_mode: 'simple',
        default_response_capture_mode: 'assigned',
        teacher_pin_hash: null,
        created_at: '',
        updated_at: '',
      },
      roster: [
        {
          id: 'membership-1',
          room_id: 'room-1',
          learner_id: 'learner-1',
          presence_status: 'online',
          can_answer: true,
          joined_at: '',
          updated_at: '',
          learner: {
            id: 'learner-1',
            auth_user_id: null,
            display_name: 'Lucy Learner',
            source: 'anonymous',
            last_seen_at: '',
            created_at: '',
            updated_at: '',
          },
        },
      ],
      rounds: [
        {
          id: 'round-1',
          room_id: 'room-1',
          sentence_resource_id: 'sentence-1',
          assigned_learner_id: 'learner-1',
          captured_learner_id: 'learner-1',
          cci_standard_card_id: 'cci-1',
          cci_standard_x: 10,
          cvr_value: 2,
          round_index: 1,
          status: 'open',
          response_capture_mode_snapshot: 'assigned',
          scoring_mode_snapshot: 'simple',
          opened_by: 'Teacher Host',
          sequence_key: 'ABC123-1',
          opened_at: '2026-07-03T15:00:00.000Z',
          closed_at: null,
          created_at: '',
          updated_at: '',
        },
      ],
      currentRound: {
        id: 'round-1',
        room_id: 'room-1',
        sentence_resource_id: 'sentence-1',
        assigned_learner_id: 'learner-1',
        captured_learner_id: 'learner-1',
        cci_standard_card_id: 'cci-1',
        cci_standard_x: 10,
        cvr_value: 2,
        round_index: 1,
        status: 'open',
        response_capture_mode_snapshot: 'assigned',
        scoring_mode_snapshot: 'simple',
        opened_by: 'Teacher Host',
        sequence_key: 'ABC123-1',
        opened_at: '2026-07-03T15:00:00.000Z',
        closed_at: null,
        created_at: '',
        updated_at: '',
      },
      currentSentence: sentences[0],
      availableSentences: sentences,
      cciCards: [{ id: 'cci-1', category_id: 'standard', label: '1-ON-1', standard_value: 10, active: true, created_at: '', updated_at: '' }],
    })
  })

  it('renders teacher sequence, audio controls, replay, and keyboard advance after captured response', async () => {
    const user = userEvent.setup()
    render(<TeacherRoomPage roomCode="ABC123" />)

    expect(await screen.findByText(/Sentence 1 \/ 3/i)).toBeInTheDocument()
    expect(screen.getByText(/Next:/i).parentElement).toHaveTextContent('S002')
    expect(screen.getByRole('heading', { name: /teacher playback/i })).toBeInTheDocument()
    expect(screen.getByLabelText(/English audio/i)).toBeChecked()

    await user.click(screen.getByRole('button', { name: /replay audio/i }))
    expect(FakeAudio.instances.at(-1)?.src).toBe('en-1.mp3')

    await user.keyboard('{ArrowRight}')
    await waitFor(() => expect(advanceRound).toHaveBeenCalled())
  })

  it('saves an upcoming-only resource filter while keeping played history locked', async () => {
    const user = userEvent.setup()
    render(<TeacherRoomPage roomCode="ABC123" />)

    expect(await screen.findByText(/Upcoming resources/i)).toBeInTheDocument()
    expect(screen.getByText(/Locked history/i)).toBeInTheDocument()
    expect(screen.getAllByText('S001').length).toBeGreaterThan(0)

    await user.click(screen.getByLabelText('Include S003'))
    await user.click(screen.getByRole('button', { name: /save upcoming filter/i }))

    await waitFor(() => {
      expect(updateRoomResourceFilter).toHaveBeenCalledWith(expect.objectContaining({ room: expect.objectContaining({ id: 'room-1' }) }), [
        'sentence-2',
      ])
    })
  })

  it('renders learner screen with sentence code only and hides prompt details', async () => {
    vi.mocked(loadLearnerRoomState).mockResolvedValue({
      room: {
        id: 'room-1',
        room_code: 'ABC123',
        title: 'Playback Room',
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
      },
      membership: {
        id: 'membership-1',
        room_id: 'room-1',
        learner_id: 'learner-1',
        presence_status: 'online',
        can_answer: true,
        joined_at: '',
        updated_at: '',
      },
      currentRound: {
        id: 'round-1',
        room_id: 'room-1',
        sentence_resource_id: 'sentence-1',
        assigned_learner_id: 'learner-1',
        captured_learner_id: null,
        cci_standard_card_id: 'cci-1',
        cci_standard_x: 10,
        cvr_value: 2,
        round_index: 1,
        status: 'open',
        response_capture_mode_snapshot: 'assigned',
        scoring_mode_snapshot: 'simple',
        opened_by: 'Teacher Host',
        sequence_key: 'ABC123-1',
        opened_at: '2026-07-03T15:00:00.000Z',
        closed_at: null,
        created_at: '',
        updated_at: '',
      },
      currentSentence: sentences[0],
      existingResponse: null,
      learnerState: 'assigned',
      disabledReason: null,
    })

    render(<LearnerRoomPage learnerId="learner-1" roomCode="ABC123" />)

    expect(await screen.findByText('S001')).toBeInTheDocument()
    expect(screen.queryByText('Teacher detail one')).not.toBeInTheDocument()
    expect(screen.queryByText('vi one')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: /green/i })).toBeEnabled()
  })
})

function makeSentence(
  id: string,
  sentenceCode: string,
  textEn: string,
  textVi: string,
  audioEnUrl: string | null,
  audioViUrl: string | null,
  orderIndex: number,
): SentenceResource {
  return {
    id,
    course_id: 'course-1',
    lesson_id: 'lesson-1',
    section_id: 'section-1',
    sentence_code: sentenceCode,
    text_prompt: null,
    text_en: textEn,
    text_vi: textVi,
    audio_url: null,
    audio_en_url: audioEnUrl,
    audio_vi_url: audioViUrl,
    audio_variants: {},
    default_cvr_unit_id: null,
    default_cvr_value: 1,
    cvr_value: 12,
    order_index: orderIndex,
    approval_status: 'approved',
    created_at: '',
    updated_at: '',
  }
}
