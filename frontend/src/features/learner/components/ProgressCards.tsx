import { Card } from '../../../components/ui/Card'
import { StatusBadge } from '../../../components/ui/StatusBadge'
import type { LearnerProgressSummary } from '../../../lib/domain/types'

interface ProgressCardsProps {
  summary: LearnerProgressSummary | null
}

export function ProgressCards({ summary }: ProgressCardsProps) {
  if (!summary) {
    return (
      <Card>
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-xl font-semibold text-chunks-ink">My progress</h2>
          <StatusBadge tone="neutral">No responses yet</StatusBadge>
        </div>
        <p className="mt-5 rounded-2xl bg-chunks-soft p-4 text-sm leading-6 text-chunks-body">
          Your CPD, color mix, and reflection time will appear after your first captured response.
        </p>
      </Card>
    )
  }

  return (
    <Card>
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-xl font-semibold text-chunks-ink">My progress</h2>
        <StatusBadge tone={summary.response_count > 0 ? 'success' : 'neutral'}>
          {summary.response_count} responses
        </StatusBadge>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <MetricCard label="Total CPD" value={formatNumber(summary.total_cpd)} />
        <MetricCard label="Average CPD" value={formatNumber(summary.average_cpd)} />
        <MetricCard label="Highest CPD" value={formatNumber(summary.highest_cpd)} />
        <MetricCard label="Avg reflection" value={`${formatNumber(summary.average_reflection_seconds)}s`} />
      </div>

      <div className="mt-5 grid grid-cols-3 gap-2 text-center text-sm font-semibold">
        <ColorCount label="Red" toneClass="bg-red-100 text-red-800" value={summary.red_count} />
        <ColorCount label="Yellow" toneClass="bg-yellow-100 text-yellow-800" value={summary.yellow_count} />
        <ColorCount label="Green" toneClass="bg-green-100 text-green-800" value={summary.green_count} />
      </div>
    </Card>
  )
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-chunks-hairline bg-chunks-soft p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-chunks-body">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-chunks-ink">{value}</p>
    </div>
  )
}

function ColorCount({ label, toneClass, value }: { label: string; toneClass: string; value: number }) {
  return (
    <div className={`rounded-2xl px-3 py-4 ${toneClass}`}>
      <p className="text-xs uppercase tracking-[0.14em]">{label}</p>
      <p className="mt-1 text-xl">{value}</p>
    </div>
  )
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(value)
}
