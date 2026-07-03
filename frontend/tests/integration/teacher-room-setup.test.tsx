import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { TeacherSetupPage } from '../../src/features/teacher/TeacherSetupPage'
import { countApprovedSentenceResources, createTeacherRoom, loadTeacherSetupData, type TeacherSetupData } from '../../src/features/teacher/teacherRoomService'

vi.mock('../../src/features/teacher/teacherRoomService', () => ({
  countApprovedSentenceResources: vi.fn(),
  createTeacherRoom: vi.fn(),
  loadTeacherSetupData: vi.fn(),
}))

const setupData: TeacherSetupData = {
  courses: [
    { id: 'course-1', title: 'Course A', status: 'active', created_at: '', updated_at: '' },
  ],
  lessons: [
    { id: 'lesson-1', course_id: 'course-1', title: 'Lesson 1', order_index: 1, status: 'draft', created_at: '', updated_at: '' },
    { id: 'lesson-2', course_id: 'course-1', title: 'D12 - L8- Viettel', order_index: 2, status: 'draft', created_at: '', updated_at: '' },
  ],
  sections: [
    { id: 'section-1', lesson_id: 'lesson-1', title: 'Keywords', order_index: 1, status: 'active', created_at: '', updated_at: '' },
    { id: 'section-2', lesson_id: 'lesson-1', title: 'Grammar', order_index: 2, status: 'active', created_at: '', updated_at: '' },
    { id: 'section-3', lesson_id: 'lesson-2', title: 'Slang', order_index: 1, status: 'active', created_at: '', updated_at: '' },
    { id: 'section-4', lesson_id: 'lesson-2', title: 'Vocab', order_index: 2, status: 'active', created_at: '', updated_at: '' },
  ],
  cciCards: [
    { id: 'cci-1', category_id: 'fluency', label: 'Clear meaning', standard_value: 1.25, active: true, created_at: '', updated_at: '' },
  ],
}

describe('TeacherSetupPage', () => {
  beforeEach(() => {
    vi.mocked(loadTeacherSetupData).mockResolvedValue(setupData)
    vi.mocked(countApprovedSentenceResources).mockImplementation(async ({ sectionIds }) => sectionIds.length)
    vi.mocked(createTeacherRoom).mockResolvedValue({
      room: {
        id: 'room-1',
        room_code: 'ABC123',
        title: 'CHUNKS Mirror Practice',
        status: 'lobby',
        current_round_id: null,
        course_id: 'course-1',
        lesson_id: 'lesson-1',
        host_name: 'Teacher Host',
        resource_scope_filter: {},
        snapshot_sentence_resource_ids: ['sentence-1'],
        scope_refreshed_at: '',
        scoring_mode: 'simple',
        default_response_capture_mode: 'assigned',
        teacher_pin_hash: null,
        created_at: '',
        updated_at: '',
      },
      shareLink: 'http://localhost/room/ABC123',
    })
  })

  it('loads approved setup data and creates an assigned-mode room', async () => {
    const user = userEvent.setup()
    const onRoomCreated = vi.fn()

    render(<TeacherSetupPage onRoomCreated={onRoomCreated} />)

    expect(await screen.findByRole('heading', { name: /create a live room/i })).toBeInTheDocument()
    expect(await screen.findByText('Course A')).toBeInTheDocument()
    const keywords = screen.getByLabelText('Keywords')
    const grammar = screen.getByLabelText('Grammar')
    expect(keywords).toBeChecked()
    expect(grammar).toBeChecked()
    await waitFor(() => expect(screen.getByText(/Filtered resources/i).parentElement).toHaveTextContent('2'))
    expect(screen.getAllByText(/2\/2 sections · 2 resources/i).length).toBeGreaterThan(0)

    await user.click(grammar)
    expect(keywords).toBeChecked()
    expect(grammar).not.toBeChecked()
    await waitFor(() => expect(screen.getByText(/Filtered resources/i).parentElement).toHaveTextContent('1'))
    expect(screen.getAllByText(/1\/2 sections · 1 resources/i).length).toBeGreaterThan(0)

    await user.selectOptions(screen.getByLabelText(/lesson/i), 'lesson-2')
    expect(screen.getByLabelText('Slang')).toBeChecked()
    expect(screen.getByLabelText('Vocab')).toBeChecked()
    await waitFor(() => expect(screen.getByText(/Filtered resources/i).parentElement).toHaveTextContent('2'))
    expect(screen.getAllByText(/2\/2 sections · 2 resources/i).length).toBeGreaterThan(0)

    await user.click(screen.getByRole('button', { name: /create room/i }))

    await waitFor(() => {
      expect(createTeacherRoom).toHaveBeenCalledWith({
        title: 'CHUNKS Mirror Practice',
        hostName: 'Teacher Host',
        courseId: 'course-1',
        lessonId: 'lesson-2',
        sectionIds: ['section-3', 'section-4'],
        cciStandardCardId: 'cci-1',
        captureMode: 'assigned',
        scoringMode: 'simple',
      })
    })
    expect(onRoomCreated).toHaveBeenCalledWith('ABC123')
  })
})
