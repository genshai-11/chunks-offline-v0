import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { AdminWorkspacePage } from '../../src/features/admin/AdminWorkspacePage'
import { loadSessionAnalytics } from '../../src/features/admin/analytics/analyticsService'
import { loadCciAdminData, saveCciStandardCard } from '../../src/features/admin/cci/cciService'
import { loadCvrUnits, saveCvrUnit } from '../../src/features/admin/cvr/cvrService'
import {
  batchUpdateApprovalStatus,
  loadResourceManagerData,
  requestAudioGeneration,
  requestAudioGenerationBatch,
  saveSentenceResource,
} from '../../src/features/admin/resources/resourceService'

vi.mock('../../src/features/admin/resources/resourceService', () => ({
  batchUpdateApprovalStatus: vi.fn(),
  buildAudioStoragePath: vi.fn((resource, language) => `sentence-audio/${resource.course_id}/${resource.lesson_id}/${resource.sentence_code}-${language}.mp3`),
  filterResourcesByAudio: vi.fn((resources, filter) => {
    if (filter === 'missing-en') return resources.filter((resource: { audio_en_url?: string | null }) => !resource.audio_en_url)
    if (filter === 'missing-vi') return resources.filter((resource: { audio_vi_url?: string | null }) => !resource.audio_vi_url)
    return resources
  }),
  getMissingAudioQueueItems: vi.fn((resources) => resources.flatMap((resource: { id: string; course_id: string; lesson_id: string; sentence_code: string; audio_en_url?: string | null; audio_vi_url?: string | null }) => {
    const jobs: Array<{ language: string; resourceId: string; sentenceCode: string; storagePath: string }> = []
    if (!resource.audio_en_url) jobs.push({ language: 'en', resourceId: resource.id, sentenceCode: resource.sentence_code, storagePath: `sentence-audio/${resource.course_id}/${resource.lesson_id}/${resource.sentence_code}-en.mp3` })
    if (!resource.audio_vi_url) jobs.push({ language: 'vi', resourceId: resource.id, sentenceCode: resource.sentence_code, storagePath: `sentence-audio/${resource.course_id}/${resource.lesson_id}/${resource.sentence_code}-vi.mp3` })
    return jobs
  })),
  loadResourceManagerData: vi.fn(),
  requestAudioGeneration: vi.fn(),
  requestAudioGenerationBatch: vi.fn(),
  saveSentenceResource: vi.fn(),
}))

vi.mock('../../src/features/admin/cci/cciService', () => ({
  loadCciAdminData: vi.fn(),
  saveCciStandardCard: vi.fn(),
}))

vi.mock('../../src/features/admin/cvr/cvrService', () => ({
  loadCvrUnits: vi.fn(),
  saveCvrUnit: vi.fn(),
}))

vi.mock('../../src/features/admin/analytics/analyticsService', () => ({
  loadSessionAnalytics: vi.fn(),
}))

const resource = {
  id: 'resource-1',
  course_id: 'course-1',
  lesson_id: 'lesson-1',
  section_id: 'section-1',
  sentence_code: 'A-001',
  text_prompt: null,
  text_en: 'Teacher-only English prompt',
  text_vi: 'Teacher-only Vietnamese prompt',
  audio_url: null,
  audio_en_url: null,
  audio_vi_url: 'https://cdn.example/vi.mp3',
  audio_variants: {},
  default_cvr_unit_id: null,
  default_cvr_value: 1,
  cvr_value: 12,
  order_index: 1,
  approval_status: 'draft' as const,
  created_at: '2026-07-03T16:00:00.000Z',
  updated_at: '2026-07-03T16:00:00.000Z',
}

describe('Admin resource manager', () => {
  beforeEach(() => {
    vi.mocked(loadResourceManagerData).mockResolvedValue({
      resources: [resource],
      courses: [{ id: 'course-1', title: 'Level A', status: 'active', created_at: '', updated_at: '' }],
      lessons: [{ id: 'lesson-1', course_id: 'course-1', title: 'Lesson 1', order_index: 1, status: 'draft', created_at: '', updated_at: '' }],
      sections: [{ id: 'section-1', lesson_id: 'lesson-1', title: 'Topic 1', order_index: 1, status: 'active', created_at: '', updated_at: '' }],
    })
    vi.mocked(loadCciAdminData).mockResolvedValue({ categories: [], cards: [] })
    vi.mocked(loadCvrUnits).mockResolvedValue([])
    vi.mocked(loadSessionAnalytics).mockResolvedValue({ rooms: [], learners: [], totals: { responseCount: 0, totalCpd: 0, averageReflectionSeconds: 0 } })
    vi.mocked(saveSentenceResource).mockResolvedValue(resource)
    vi.mocked(batchUpdateApprovalStatus).mockResolvedValue({ updatedCount: 1 })
    vi.mocked(requestAudioGeneration).mockResolvedValue({ queuedCount: 1, status: 'queued', message: 'Queued 1 secure audio generation job.' })
    vi.mocked(requestAudioGenerationBatch).mockResolvedValue({ queuedCount: 1, status: 'queued', message: 'Queued 1 secure audio generation job.' })
    vi.mocked(saveCciStandardCard).mockResolvedValue({ id: 'card-1', category_id: 'fluency', label: 'Clear response', standard_value: 10, active: true, created_at: '', updated_at: '' })
    vi.mocked(saveCvrUnit).mockResolvedValue({ id: 'cvr-1', label: 'Default', unit_symbol: 'Ω', value: 1, active: true, created_at: '', updated_at: '' })
  })

  it('filters missing audio resources, saves CVR/audio fields, and confirms batch approval', async () => {
    const user = userEvent.setup()
    render(<AdminWorkspacePage />)

    expect(await screen.findByRole('heading', { name: /admin workspace/i })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /missing english audio/i }))

    const resourceCard = screen.getByText('A-001').closest('.theme-card') as HTMLElement
    expect(resourceCard).toBeInTheDocument()
    expect(within(resourceCard).getByText(/missing en audio/i)).toBeInTheDocument()

    await user.clear(screen.getByLabelText(/^CVR Ω$/i))
    await user.type(screen.getByLabelText(/^CVR Ω$/i), '15')
    await user.click(screen.getByRole('button', { name: /save resource/i }))
    expect(saveSentenceResource).toHaveBeenCalledWith(expect.objectContaining({ id: 'resource-1', cvrValue: 15 }))

    await user.click(screen.getByRole('button', { name: /generate all missing audio/i }))
    expect(requestAudioGenerationBatch).toHaveBeenCalledWith([
      {
        language: 'en',
        resourceId: 'resource-1',
        sentenceCode: 'A-001',
        storagePath: 'sentence-audio/course-1/lesson-1/A-001-en.mp3',
      },
    ])
    expect(screen.getByText(/storage path pattern/i)).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /generate missing audio securely/i }))
    expect(requestAudioGeneration).toHaveBeenCalledWith({
      language: 'en',
      resourceId: 'resource-1',
      storagePath: 'sentence-audio/course-1/lesson-1/A-001-en.mp3',
    })

    await user.click(screen.getByRole('button', { name: /approve selected/i }))
    expect(screen.getByRole('dialog', { name: /approve selected resource/i })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /confirm action/i }))
    expect(batchUpdateApprovalStatus).toHaveBeenCalledWith({ approvalStatus: 'approved', resourceIds: ['resource-1'] })
  })
})
