import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { HistoryPage } from '../../src/features/admin/HistoryPage'
import { loadSessionAnalytics } from '../../src/features/admin/analytics/analyticsService'
import { loadCciAdminData, saveCciStandardCard } from '../../src/features/admin/cci/cciService'
import { loadCvrUnits, saveCvrUnit } from '../../src/features/admin/cvr/cvrService'
import { loadResourceManagerData } from '../../src/features/admin/resources/resourceService'

vi.mock('../../src/features/admin/resources/resourceService', () => ({
  batchUpdateApprovalStatus: vi.fn(),
  buildAudioStoragePath: vi.fn(),
  filterResourcesByAudio: vi.fn((resources) => resources),
  getMissingAudioQueueItems: vi.fn(() => []),
  loadResourceManagerData: vi.fn(),
  requestAudioGeneration: vi.fn(),
  requestAudioGenerationBatch: vi.fn(),
  saveSentenceResource: vi.fn(),
}))
vi.mock('../../src/features/admin/cci/cciService', () => ({ loadCciAdminData: vi.fn(), saveCciStandardCard: vi.fn() }))
vi.mock('../../src/features/admin/cvr/cvrService', () => ({ loadCvrUnits: vi.fn(), saveCvrUnit: vi.fn() }))
vi.mock('../../src/features/admin/analytics/analyticsService', () => ({ loadSessionAnalytics: vi.fn() }))

describe('Admin session analytics', () => {
  beforeEach(() => {
    vi.mocked(loadResourceManagerData).mockResolvedValue({ resources: [], courses: [], lessons: [], sections: [] })
    vi.mocked(loadCciAdminData).mockResolvedValue({ categories: [], cards: [] })
    vi.mocked(loadCvrUnits).mockResolvedValue([])
    vi.mocked(loadSessionAnalytics).mockResolvedValue({
      totals: { responseCount: 3, totalCpd: 70, averageReflectionSeconds: 1.85 },
      rooms: [{ roomCode: 'ROOM01', title: 'Demo Room', responseCount: 3, totalCpd: 70, averageCpd: 23.33, completedRounds: 3 }],
      learners: [
        { learnerName: 'An', responseCount: 2, redCount: 0, yellowCount: 1, greenCount: 1, purpleCount: 0, totalCpd: 70, averageReflectionSeconds: 1.85 },
      ],
    })
    vi.mocked(saveCvrUnit).mockResolvedValue({ id: 'cvr-1', label: 'Default', unit_symbol: 'Ω', value: 1, active: true, created_at: '', updated_at: '' })
    vi.mocked(saveCciStandardCard).mockResolvedValue({ id: 'card-1', category_id: 'fluency', label: 'Clear response', standard_value: 10, active: true, created_at: '', updated_at: '' })
  })

  it('filters history by sessions or learners without mixing Library content', async () => {
    const user = userEvent.setup()
    render(<HistoryPage />)

    const analytics = await screen.findByRole('region', { name: /history and analytics/i })
    expect(within(analytics).getAllByText('3').length).toBeGreaterThanOrEqual(1)
    expect(within(analytics).getAllByText('70').length).toBeGreaterThanOrEqual(1)
    expect(within(analytics).getByText(/ROOM01/i)).toBeInTheDocument()
    expect(within(analytics).queryByText('An')).not.toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: /resource library/i })).not.toBeInTheDocument()

    await user.click(within(analytics).getByRole('tab', { name: /learners/i }))
    const learnerRow = within(analytics).getByText('An').closest('article') as HTMLElement
    expect(learnerRow).toBeInTheDocument()
    expect(within(learnerRow).getByText('Green')).toBeInTheDocument()
    expect(within(learnerRow).getAllByText('1').length).toBeGreaterThanOrEqual(1)
  })
})
