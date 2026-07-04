import type { ReactNode } from 'react'
import { useCallback, useEffect, useState } from 'react'

import { AppShell } from '../../components/layout/AppShell'
import { WorkspaceLayout } from '../../components/layout/WorkspaceLayout'
import { Alert } from '../../components/ui/Alert'
import { Card } from '../../components/ui/Card'
import { loadSessionAnalytics, type AdminSessionAnalytics } from './analytics/analyticsService'
import { SessionAnalyticsDashboard } from './analytics/SessionAnalyticsDashboard'
import { CciManager } from './cci/CciManager'
import { loadCciAdminData, type CciAdminData } from './cci/cciService'
import { CvrManager } from './cvr/CvrManager'
import { loadCvrUnits } from './cvr/cvrService'
import { ResourceManager } from './resources/ResourceManager'
import { loadResourceManagerData, type ResourceManagerData } from './resources/resourceService'
import type { CvrUnit } from '../../lib/domain/types'

interface AdminWorkspacePageProps {
  themeControl?: ReactNode
}

interface AdminWorkspaceState {
  analytics: AdminSessionAnalytics
  cci: CciAdminData
  cvrUnits: CvrUnit[]
  resources: ResourceManagerData
}

const emptyState: AdminWorkspaceState = {
  analytics: { learners: [], rooms: [], totals: { averageReflectionSeconds: 0, responseCount: 0, totalCpd: 0 } },
  cci: { cards: [], categories: [] },
  cvrUnits: [],
  resources: { courses: [], lessons: [], resources: [], sections: [] },
}

export function AdminWorkspacePage({ themeControl }: AdminWorkspacePageProps) {
  const [state, setState] = useState<AdminWorkspaceState>(emptyState)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const refresh = useCallback(async () => {
    const [resources, cci, cvrUnits, analytics] = await Promise.all([
      loadResourceManagerData(),
      loadCciAdminData(),
      loadCvrUnits(),
      loadSessionAnalytics(),
    ])
    setState({ analytics, cci, cvrUnits, resources })
    setError(null)
  }, [])

  useEffect(() => {
    let mounted = true
    setIsLoading(true)
    refresh()
      .catch((loadError: unknown) => {
        if (mounted) setError(getErrorMessage(loadError))
      })
      .finally(() => {
        if (mounted) setIsLoading(false)
      })
    return () => {
      mounted = false
    }
  }, [refresh])

  return (
    <AppShell
      description="Prepare approved sentence resources, CVR Ω values, CCI standards, secure audio jobs, and session analytics before classroom use."
      eyebrow="Admin Workspace"
      headerMeta={
        <Card className="p-4">
          <p className="text-sm font-semibold text-chunks-body">Admin status</p>
          <p className="mt-2 text-xl font-semibold text-chunks-ink">{isLoading ? 'Loading' : 'Ready'}</p>
        </Card>
      }
      statusLabel="Admin"
      themeControl={themeControl}
      title="Admin workspace"
    >
      {isLoading ? <Alert className="mb-5" title="Loading Admin data">Fetching resources, CCI cards, CVR values, and analytics.</Alert> : null}
      {error ? <Alert className="mb-5" title="Admin data unavailable" tone="error">{error}</Alert> : null}

      <WorkspaceLayout
        primary={
          <>
            <ResourceManager
              courses={state.resources.courses}
              lessons={state.resources.lessons}
              onRefresh={refresh}
              resources={state.resources.resources}
              sections={state.resources.sections}
            />
            <SessionAnalyticsDashboard analytics={state.analytics} />
          </>
        }
        secondary={
          <>
            <CciManager cards={state.cci.cards} categories={state.cci.categories} onRefresh={refresh} />
            <CvrManager onRefresh={refresh} units={state.cvrUnits} />
          </>
        }
      />
    </AppShell>
  )
}

function getErrorMessage(error: unknown): string {
  if (error && typeof error === 'object' && 'message' in error) return String(error.message)
  return 'Something went wrong. Please try again.'
}
