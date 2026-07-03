import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { ProgressCards } from '../../src/features/learner/components/ProgressCards'
import { LastCapturedResponse } from '../../src/features/learner/components/LastCapturedResponse'
import { CapturedResponsePanel } from '../../src/features/teacher/components/CapturedResponsePanel'
import {
  buildRoomProgressState,
  type ProgressMembership,
  type ProgressRound,
} from '../../src/features/live-room/progressService'
import type { LearnerResponse } from '../../src/lib/domain/types'

const memberships: ProgressMembership[] = [
  {
    id: 'membership-1',
    room_id: 'room-1',
    learner_id: 'learner-1',
    presence_status: 'online',
    can_answer: true,
    joined_at: '2026-07-03T14:00:00.000Z',
    updated_at: '2026-07-03T14:00:00.000Z',
    learner: {
      id: 'learner-1',
      auth_user_id: null,
      display_name: 'An',
      source: 'anonymous',
      last_seen_at: '2026-07-03T14:00:00.000Z',
      created_at: '2026-07-03T14:00:00.000Z',
      updated_at: '2026-07-03T14:00:00.000Z',
    },
  },
  {
    id: 'membership-2',
    room_id: 'room-1',
    learner_id: 'learner-2',
    presence_status: 'online',
    can_answer: true,
    joined_at: '2026-07-03T14:01:00.000Z',
    updated_at: '2026-07-03T14:01:00.000Z',
    learner: {
      id: 'learner-2',
      auth_user_id: null,
      display_name: 'Binh',
      source: 'anonymous',
      last_seen_at: '2026-07-03T14:01:00.000Z',
      created_at: '2026-07-03T14:01:00.000Z',
      updated_at: '2026-07-03T14:01:00.000Z',
    },
  },
]

const rounds: ProgressRound[] = [
  { id: 'round-1', room_id: 'room-1', round_index: 1, status: 'closed', sentence_resource_id: 'sentence-1' },
  { id: 'round-2', room_id: 'room-1', round_index: 2, status: 'closed', sentence_resource_id: 'sentence-2' },
  { id: 'round-3', room_id: 'room-1', round_index: 3, status: 'open', sentence_resource_id: 'sentence-3' },
]

const responses: LearnerResponse[] = [
  {
    id: 'response-1',
    round_id: 'round-1',
    learner_id: 'learner-1',
    performance_y: 2,
    response_color: 'green',
    cci_standard_x: 10,
    cvr_value: 2,
    cci_result: 20,
    cpd_result: 40,
    reflection_time_ms: 1200,
    reflection_seconds: 1.2,
    finalized: true,
    scoring_mode_snapshot: 'simple',
    response_capture_mode_snapshot: 'assigned',
    submitted_at: '2026-07-03T14:05:00.000Z',
    updated_at: '2026-07-03T14:05:00.000Z',
  },
  {
    id: 'response-2',
    round_id: 'round-2',
    learner_id: 'learner-1',
    performance_y: 1,
    response_color: 'yellow',
    cci_standard_x: 10,
    cvr_value: 3,
    cci_result: 10,
    cpd_result: 30,
    reflection_time_ms: 2500,
    reflection_seconds: 2.5,
    finalized: true,
    scoring_mode_snapshot: 'simple',
    response_capture_mode_snapshot: 'assigned',
    submitted_at: '2026-07-03T14:06:00.000Z',
    updated_at: '2026-07-03T14:06:00.000Z',
  },
  {
    id: 'response-3',
    round_id: 'round-3',
    learner_id: 'learner-2',
    performance_y: 0,
    response_color: 'red',
    cci_standard_x: 15,
    cvr_value: 2,
    cci_result: 0,
    cpd_result: 0,
    reflection_time_ms: 900,
    reflection_seconds: 0.9,
    finalized: true,
    scoring_mode_snapshot: 'simple',
    response_capture_mode_snapshot: 'assigned',
    submitted_at: '2026-07-03T14:07:00.000Z',
    updated_at: '2026-07-03T14:07:00.000Z',
  },
]

describe('Phase 5 progress summary foundation', () => {
  it('builds learner summaries from mocked room responses', () => {
    const state = buildRoomProgressState({ memberships, responses, rounds })

    expect(state.summaries).toHaveLength(2)
    expect(state.lastCapturedResponse?.learner?.display_name).toBe('Binh')
    expect(state.lastCapturedResponse?.response_color).toBe('red')

    const an = state.summaries.find((row) => row.learner?.display_name === 'An')
    expect(an?.summary.response_count).toBe(2)
    expect(an?.summary.green_count).toBe(1)
    expect(an?.summary.yellow_count).toBe(1)
    expect(an?.summary.total_cpd).toBe(70)
    expect(an?.summary.average_cpd).toBe(35)
    expect(an?.summary.average_reflection_seconds).toBe(1.85)
  })

  it('renders learner and teacher progress components with mocked data', () => {
    const state = buildRoomProgressState({ memberships, responses, rounds })
    const an = state.summaries.find((row) => row.learner?.display_name === 'An')

    render(
      <div>
        <ProgressCards summary={an?.summary ?? null} />
        <LastCapturedResponse response={an?.lastResponse ?? null} />
        <CapturedResponsePanel lastResponse={state.lastCapturedResponse} summaries={state.summaries} />
      </div>,
    )

    const progressCard = screen.getByRole('heading', { name: /my progress/i }).closest('.theme-card')
    expect(progressCard).toBeInTheDocument()
    expect(within(progressCard as HTMLElement).getByText('Total CPD').parentElement).toHaveTextContent('70')
    expect(within(progressCard as HTMLElement).getByText('Average CPD').parentElement).toHaveTextContent('35')
    expect(within(progressCard as HTMLElement).getByText('Highest CPD').parentElement).toHaveTextContent('40')

    const learnerLastResponse = screen.getByRole('heading', { name: /last captured response/i }).closest('.theme-card')
    expect(learnerLastResponse).toHaveTextContent('yellow')
    expect(learnerLastResponse).toHaveTextContent('Round 2')
    expect(learnerLastResponse).toHaveTextContent('30')

    const teacherPanel = screen.getByRole('heading', { name: /room progress/i }).closest('.theme-card')
    expect(teacherPanel).toHaveTextContent('Binh')
    expect(teacherPanel).toHaveTextContent('red')
    expect(teacherPanel).toHaveTextContent('3 captured')
    expect(within(teacherPanel as HTMLElement).getByText('Total CPD').parentElement).toHaveTextContent('70')
  })
})
