import { render, screen, within } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { AdminWorkspacePage } from '../../src/features/admin/AdminWorkspacePage'
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
        { learnerName: 'An', responseCount: 2, redCount: 0, yellowCount: 1, greenCount: 1, totalCpd: 70, averageReflectionSeconds: 1.85 },
      ],
    })
    vi.mocked(saveCvrUnit).mockResolvedValue({ id: 'cvr-1', label: 'Default', unit_symbol: 'Ω', value: 1, active: true, created_at: '', updated_at: '' })
    vi.mocked(saveCciStandardCard).mockResolvedValue({ id: 'card-1', category_id: 'fluency', label: 'Clear response', standard_value: 10, active: true, created_at: '', updated_at: '' })
  })

  it('shows room/session and learner response analytics', async () => {
    render(<AdminWorkspacePage />)

    const analytics = await screen.findByRole('region', { name: /session analytics/i })
    expect(within(analytics).getByText('3')).toBeInTheDocument()
    expect(within(analytics).getByText('70')).toBeInTheDocument()
    expect(within(analytics).getByText('ROOM01')).toBeInTheDocument()
    expect(within(analytics).getByText('An')).toBeInTheDocument()
    expect(within(analytics).getByText(/green 1/i)).toBeInTheDocument()
  })
})
