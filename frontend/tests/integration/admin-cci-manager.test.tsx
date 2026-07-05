import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { LibraryPage } from '../../src/features/admin/LibraryPage'
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

describe('Admin CCI manager', () => {
  beforeEach(() => {
    vi.mocked(loadResourceManagerData).mockResolvedValue({ resources: [], courses: [], lessons: [], sections: [] })
    vi.mocked(loadCciAdminData).mockResolvedValue({
      categories: [{ id: 'fluency', label: 'Fluency', active: true, created_at: '', updated_at: '' }],
      cards: [{ id: 'card-1', category_id: 'fluency', label: 'Clear response', standard_value: 10, active: true, created_at: '', updated_at: '' }],
    })
    vi.mocked(loadCvrUnits).mockResolvedValue([])
    vi.mocked(loadSessionAnalytics).mockResolvedValue({ rooms: [], learners: [], totals: { responseCount: 0, totalCpd: 0, averageReflectionSeconds: 0 } })
    vi.mocked(saveCciStandardCard).mockResolvedValue({ id: 'card-1', category_id: 'fluency', label: 'Clear response', standard_value: 12, active: true, created_at: '', updated_at: '' })
    vi.mocked(saveCvrUnit).mockResolvedValue({ id: 'cvr-1', label: 'Default', unit_symbol: 'Ω', value: 1, active: true, created_at: '', updated_at: '' })
  })

  it('renders active CCI cards and saves updated standard values', async () => {
    const user = userEvent.setup()
    render(<LibraryPage />)

    expect(await screen.findByText('Clear response')).toBeInTheDocument()
    await user.clear(screen.getByLabelText(/cci standard x/i))
    await user.type(screen.getByLabelText(/cci standard x/i), '12')
    await user.click(screen.getByRole('button', { name: /save cci card/i }))

    expect(saveCciStandardCard).toHaveBeenCalledWith(
      expect.objectContaining({ active: true, categoryId: 'fluency', id: 'card-1', label: 'Clear response', standardValue: 12 }),
    )
  })
})
