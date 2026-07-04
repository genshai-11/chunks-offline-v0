import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
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

describe('Admin CVR manager', () => {
  beforeEach(() => {
    vi.mocked(loadResourceManagerData).mockResolvedValue({ resources: [], courses: [], lessons: [], sections: [] })
    vi.mocked(loadCciAdminData).mockResolvedValue({ categories: [], cards: [] })
    vi.mocked(loadCvrUnits).mockResolvedValue([
      { id: 'cvr-1', label: 'High reuse', unit_symbol: 'Ω', value: 18, active: true, created_at: '', updated_at: '' },
    ])
    vi.mocked(loadSessionAnalytics).mockResolvedValue({ rooms: [], learners: [], totals: { responseCount: 0, totalCpd: 0, averageReflectionSeconds: 0 } })
    vi.mocked(saveCvrUnit).mockResolvedValue({ id: 'cvr-1', label: 'High reuse', unit_symbol: 'Ω', value: 21, active: true, created_at: '', updated_at: '' })
    vi.mocked(saveCciStandardCard).mockResolvedValue({ id: 'card-1', category_id: 'fluency', label: 'Clear response', standard_value: 10, active: true, created_at: '', updated_at: '' })
  })

  it('edits active CVR values used by sentence resources', async () => {
    const user = userEvent.setup()
    render(<AdminWorkspacePage />)

    expect(await screen.findByText('High reuse')).toBeInTheDocument()
    await user.clear(screen.getByLabelText(/cvr unit value/i))
    await user.type(screen.getByLabelText(/cvr unit value/i), '21')
    await user.click(screen.getByRole('button', { name: /save cvr value/i }))

    expect(saveCvrUnit).toHaveBeenCalledWith(expect.objectContaining({ active: true, id: 'cvr-1', label: 'High reuse', value: 21 }))
  })
})
