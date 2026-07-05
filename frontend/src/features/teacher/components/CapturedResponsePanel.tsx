import { Badge, Card } from '../../../components/primitives'
import type { CapturedResponseDetail, ProgressSummaryRow } from '../../live-room/progressService'

interface CapturedResponsePanelProps {
  lastResponse: CapturedResponseDetail | null
  summaries: ProgressSummaryRow[]
}

const toneByColor = {
  red: 'error',
  yellow: 'warning',
  green: 'success',
  purple: 'info',
} as const

export function CapturedResponsePanel({ lastResponse, summaries }: CapturedResponsePanelProps) {
  const totalResponses = summaries.reduce((total, row) => total + row.summary.response_count, 0)
  const totalCpd = summaries.reduce((total, row) => total + row.summary.total_cpd, 0)

  return (
    <Card>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-chunks-body">Captured response</p>
          <h2 className="mt-1 text-xl font-semibold text-chunks-ink">Room progress</h2>
        </div>
        <Badge tone={lastResponse ? 'success' : 'neutral'}>{totalResponses} captured</Badge>
      </div>

      {lastResponse ? (
        <div className="mt-5 rounded-2xl border border-chunks-hairline bg-chunks-soft p-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-chunks-body">
                {lastResponse.learner?.display_name ?? 'Unnamed learner'} · {lastResponse.round ? `Round ${lastResponse.round.round_index}` : 'Round'}
              </p>
              <p className="mt-2 text-2xl font-semibold capitalize text-chunks-ink">{lastResponse.response_color}</p>
            </div>
            <Badge tone={toneByColor[lastResponse.response_color]}>{lastResponse.response_color}</Badge>
          </div>
          <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
            <Metric label="CCI" value={formatNumber(lastResponse.cci_result)} />
            <Metric label="CPD" value={formatNumber(lastResponse.cpd_result)} />
            <Metric label="Reflection" value={`${formatNumber(lastResponse.reflection_seconds)}s`} />
          </dl>
        </div>
      ) : (
        <p className="mt-5 rounded-2xl bg-chunks-soft p-4 text-sm leading-6 text-chunks-body">
          Waiting for the first accepted learner response in this room.
        </p>
      )}

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <SummaryMetric label="Total CPD" value={formatNumber(totalCpd)} />
        <SummaryMetric label="Active learners with progress" value={String(summaries.filter((row) => row.summary.response_count > 0).length)} />
      </div>
    </Card>
  )
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-semibold text-chunks-body">{label}</dt>
      <dd className="mt-1 font-semibold text-chunks-ink">{value}</dd>
    </div>
  )
}

function SummaryMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-soft">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-chunks-body">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-chunks-ink">{value}</p>
    </div>
  )
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(value)
}
