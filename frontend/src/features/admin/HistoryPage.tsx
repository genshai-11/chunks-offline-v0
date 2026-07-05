import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'

import { AppShell } from '../../components/layout/AppShell'
import { ButtonLink, Card } from '../../components/primitives'
import { Alert } from '../../components/ui/Alert'
import { loadSessionAnalytics, type AdminSessionAnalytics } from './analytics/analyticsService'
import { SessionAnalyticsDashboard } from './analytics/SessionAnalyticsDashboard'

interface HistoryPageProps {
  themeControl?: ReactNode
}

const emptyAnalytics: AdminSessionAnalytics = {
  learners: [],
  rooms: [],
  totals: { averageReflectionSeconds: 0, responseCount: 0, totalCpd: 0 },
}

export function HistoryPage({ themeControl }: HistoryPageProps) {
  const [analytics, setAnalytics] = useState<AdminSessionAnalytics>(emptyAnalytics)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    setIsLoading(true)
    loadSessionAnalytics()
      .then((nextAnalytics) => {
        if (!mounted) return
        setAnalytics(nextAnalytics)
        setError(null)
      })
      .catch((loadError: unknown) => {
        if (mounted) setError(getErrorMessage(loadError))
      })
      .finally(() => {
        if (mounted) setIsLoading(false)
      })

    return () => {
      mounted = false
    }
  }, [])

  return (
    <AppShell
      action={
        <ButtonLink href="/library" variant="secondary">
          Open Library
        </ButtonLink>
      }
      description="Review completed room sessions and learner response evidence without opening Library records."
      eyebrow="History"
      headerMeta={<HistoryAreaMap isLoading={isLoading} learnerCount={analytics.learners.length} responseCount={analytics.totals.responseCount} roomCount={analytics.rooms.length} />}
      statusLabel="History"
      themeControl={themeControl}
      title="History"
    >
      {isLoading ? <Alert className="mb-5" title="Loading History data">Fetching completed room and learner response summaries.</Alert> : null}
      {error ? <Alert className="mb-5" title="History data unavailable" tone="error">{error}</Alert> : null}
      <SessionAnalyticsDashboard analytics={analytics} />
    </AppShell>
  )
}

function HistoryAreaMap({
  isLoading,
  learnerCount,
  responseCount,
  roomCount,
}: {
  isLoading: boolean
  learnerCount: number
  responseCount: number
  roomCount: number
}) {
  return (
    <div className="grid gap-4">
      <div className="min-w-0">
        <p className="text-xs font-black uppercase tracking-[0.16em] text-chunks-body">Inside this area</p>
        <h2 className="mt-2 text-xl font-semibold text-chunks-ink">History reviews what already happened.</h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-chunks-body">
          Use session or learner views to inspect classroom evidence. Resource editing and audio readiness stay in Library.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-4">
        <SummaryTile label="System" value={isLoading ? 'Loading' : 'Ready'} />
        <SummaryTile label="Sessions" value={String(roomCount)} />
        <SummaryTile label="Learners" value={String(learnerCount)} />
        <SummaryTile label="Responses" value={String(responseCount)} />
      </div>
    </div>
  )
}

function SummaryTile({ label, value }: { label: string; value: string }) {
  return (
    <Card padding="sm" variant="outline">
      <p className="text-xs font-black uppercase tracking-[0.16em] text-chunks-body">{label}</p>
      <p className="mt-1 text-lg font-semibold text-chunks-ink">{value}</p>
    </Card>
  )
}

function getErrorMessage(error: unknown): string {
  if (error && typeof error === 'object' && 'message' in error) return String(error.message)
  return 'Something went wrong. Please try again.'
}
