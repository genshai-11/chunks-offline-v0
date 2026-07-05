import { useState } from 'react'

import { Badge, Button, Card, CardContent, CardHeader } from '../../../components/primitives'
import type { AdminSessionAnalytics } from './analyticsService'

interface SessionAnalyticsDashboardProps {
  analytics: AdminSessionAnalytics
}

type HistoryView = 'sessions' | 'learners'

export function SessionAnalyticsDashboard({ analytics }: SessionAnalyticsDashboardProps) {
  const [view, setView] = useState<HistoryView>('sessions')

  return (
    <section aria-label="History and analytics" className="grid gap-4">
      <Card padding="sm" variant="outline">
        <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0">
          <div>
            <Badge tone="brand">Read-only evidence</Badge>
            <h2 className="mt-3 text-xl font-semibold text-chunks-ink">Filter history by session or learner.</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-chunks-body">
              Keep the view narrow: session summaries for room review, learner summaries for response distribution.
            </p>
          </div>
          <Badge tone="neutral">{analytics.totals.responseCount} responses</Badge>
        </CardHeader>
        <CardContent className="mt-4 grid gap-3 md:grid-cols-3">
          <Metric label="Responses" value={formatNumber(analytics.totals.responseCount)} />
          <Metric label="Total CPD" value={formatNumber(analytics.totals.totalCpd)} />
          <Metric label="Avg reflection" value={`${formatNumber(analytics.totals.averageReflectionSeconds)}s`} />
        </CardContent>
      </Card>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-chunks-hairline bg-white p-3 shadow-none">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-chunks-body">History view</p>
          <p className="mt-1 text-sm text-chunks-body">Choose one evidence list at a time.</p>
        </div>
        <div aria-label="History filters" className="flex flex-wrap gap-2" role="tablist">
          <Button aria-selected={view === 'sessions'} onClick={() => setView('sessions')} role="tab" type="button" variant={view === 'sessions' ? 'primary' : 'secondary'}>
            Sessions
          </Button>
          <Button aria-selected={view === 'learners'} onClick={() => setView('learners')} role="tab" type="button" variant={view === 'learners' ? 'primary' : 'secondary'}>
            Learners
          </Button>
        </div>
      </div>

      {view === 'sessions' ? <SessionList analytics={analytics} /> : <LearnerList analytics={analytics} />}
    </section>
  )
}

function SessionList({ analytics }: { analytics: AdminSessionAnalytics }) {
  return (
    <Card padding="sm" variant="outline">
      <CardHeader>
        <h3 className="text-lg font-semibold text-chunks-ink">Sessions</h3>
        <p className="mt-2 text-sm text-chunks-body">Minimal room list for post-session review.</p>
      </CardHeader>
      <CardContent className="mt-4 grid gap-3">
        {analytics.rooms.length === 0 ? (
          <p className="rounded-lg border border-dashed border-chunks-hairline p-4 text-sm text-chunks-body">No completed session evidence yet.</p>
        ) : (
          analytics.rooms.map((room) => (
            <article className="rounded-xl border border-chunks-hairline bg-white p-4 shadow-none" key={room.roomCode}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-base font-semibold text-chunks-ink">{room.title}</p>
                  <p className="mt-1 text-sm text-chunks-body">Room {room.roomCode}</p>
                </div>
                <Badge tone="neutral">{room.responseCount} responses</Badge>
              </div>
              <div className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
                <Meta label="Completed rounds" value={String(room.completedRounds)} />
                <Meta label="Total CPD" value={formatNumber(room.totalCpd)} />
                <Meta label="Avg CPD" value={formatNumber(room.averageCpd)} />
              </div>
            </article>
          ))
        )}
      </CardContent>
    </Card>
  )
}

function LearnerList({ analytics }: { analytics: AdminSessionAnalytics }) {
  return (
    <Card padding="sm" variant="outline">
      <CardHeader>
        <h3 className="text-lg font-semibold text-chunks-ink">Learners</h3>
        <p className="mt-2 text-sm text-chunks-body">Minimal learner list for response distribution and CPD review.</p>
      </CardHeader>
      <CardContent className="mt-4 grid gap-3">
        {analytics.learners.length === 0 ? (
          <p className="rounded-lg border border-dashed border-chunks-hairline p-4 text-sm text-chunks-body">No learner response evidence yet.</p>
        ) : (
          analytics.learners.map((learner) => (
            <article className="rounded-xl border border-chunks-hairline bg-white p-4 shadow-none" key={learner.learnerName}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-base font-semibold text-chunks-ink">{learner.learnerName}</p>
                  <p className="mt-1 text-sm text-chunks-body">{learner.responseCount} responses</p>
                </div>
                <Badge tone="neutral">CPD {formatNumber(learner.totalCpd)}</Badge>
              </div>
              <div className="mt-4 grid gap-3 text-sm sm:grid-cols-4">
                <Meta label="Red" value={String(learner.redCount)} />
                <Meta label="Yellow" value={String(learner.yellowCount)} />
                <Meta label="Green" value={String(learner.greenCount)} />
                <Meta label="Purple" value={String(learner.purpleCount)} />
              </div>
            </article>
          ))
        )}
      </CardContent>
    </Card>
  )
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-chunks-hairline bg-chunks-soft p-4">
      <p className="text-xs font-black uppercase tracking-[0.16em] text-chunks-body">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-chunks-ink">{value}</p>
    </div>
  )
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-black uppercase tracking-[0.14em] text-chunks-body">{label}</p>
      <p className="mt-1 font-semibold text-chunks-ink">{value}</p>
    </div>
  )
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: 1 }).format(value)
}
