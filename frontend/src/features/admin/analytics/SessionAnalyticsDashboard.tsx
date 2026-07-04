import { Card } from '../../../components/ui/Card'
import { StatusBadge } from '../../../components/ui/StatusBadge'
import type { AdminSessionAnalytics } from './analyticsService'

interface SessionAnalyticsDashboardProps {
  analytics: AdminSessionAnalytics
}

export function SessionAnalyticsDashboard({ analytics }: SessionAnalyticsDashboardProps) {
  return (
    <section aria-label="Session analytics" className="space-y-4">
      <Card>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-chunks-body">Session Analytics</p>
            <h2 className="mt-1 text-2xl font-semibold text-chunks-ink">Room and learner results</h2>
          </div>
          <StatusBadge tone="brand">{analytics.totals.responseCount} responses</StatusBadge>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          <Metric label="Responses" value={formatNumber(analytics.totals.responseCount)} />
          <Metric label="Total CPD" value={formatNumber(analytics.totals.totalCpd)} />
          <Metric label="Avg reflection" value={`${formatNumber(analytics.totals.averageReflectionSeconds)}s`} />
        </div>
      </Card>

      <Card>
        <h3 className="text-xl font-semibold text-chunks-ink">Room sessions</h3>
        <div className="mt-4 space-y-3">
          {analytics.rooms.map((room) => (
            <div className="rounded-2xl border border-chunks-hairline p-4" key={room.roomCode}>
              <div className="flex flex-wrap justify-between gap-3">
                <div>
                  <p className="font-mono font-semibold text-chunks-ink">{room.roomCode}</p>
                  <p className="text-sm text-chunks-body">{room.title}</p>
                </div>
                <StatusBadge tone="success">{room.responseCount} captured</StatusBadge>
              </div>
              <p className="mt-3 text-sm text-chunks-body">
                {room.completedRounds} closed rounds · Total CPD {formatNumber(room.totalCpd)} · Avg CPD {formatNumber(room.averageCpd)}
              </p>
            </div>
          ))}
          {analytics.rooms.length === 0 ? <p className="text-sm text-chunks-body">No room analytics yet.</p> : null}
        </div>
      </Card>

      <Card>
        <h3 className="text-xl font-semibold text-chunks-ink">Learner distribution</h3>
        <div className="mt-4 space-y-3">
          {analytics.learners.map((learner) => (
            <div className="rounded-2xl border border-chunks-hairline p-4" key={learner.learnerName}>
              <div className="flex flex-wrap justify-between gap-3">
                <p className="font-semibold text-chunks-ink">{learner.learnerName}</p>
                <StatusBadge tone="neutral">{learner.responseCount} responses</StatusBadge>
              </div>
              <p className="mt-3 text-sm text-chunks-body">
                Red {learner.redCount} · Yellow {learner.yellowCount} · Green {learner.greenCount} · Total CPD {formatNumber(learner.totalCpd)} · Avg reflection {formatNumber(learner.averageReflectionSeconds)}s
              </p>
            </div>
          ))}
          {analytics.learners.length === 0 ? <p className="text-sm text-chunks-body">No learner response distribution yet.</p> : null}
        </div>
      </Card>
    </section>
  )
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-chunks-soft p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-chunks-body">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-chunks-ink">{value}</p>
    </div>
  )
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(value)
}
