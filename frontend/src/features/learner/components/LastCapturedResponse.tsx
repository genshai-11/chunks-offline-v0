import { Card } from '../../../components/ui/Card'
import { StatusBadge } from '../../../components/ui/StatusBadge'
import type { CapturedResponseDetail } from '../../live-room/progressService'

interface LastCapturedResponseProps {
  response: CapturedResponseDetail | null
}

const toneByColor = {
  red: 'error',
  yellow: 'warning',
  green: 'success',
} as const

export function LastCapturedResponse({ response }: LastCapturedResponseProps) {
  if (!response) {
    return (
      <Card>
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-xl font-semibold text-chunks-ink">Last captured response</h2>
          <StatusBadge tone="neutral">Waiting</StatusBadge>
        </div>
        <p className="mt-5 rounded-2xl bg-chunks-soft p-4 text-sm leading-6 text-chunks-body">
          No accepted response has been captured for you yet.
        </p>
      </Card>
    )
  }

  return (
    <Card>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-xl font-semibold text-chunks-ink">Last captured response</h2>
        <StatusBadge tone={toneByColor[response.response_color]}>{response.response_color}</StatusBadge>
      </div>

      <div className="mt-5 rounded-2xl border border-chunks-hairline bg-chunks-soft p-4">
        <p className="text-sm font-semibold text-chunks-body">
          {response.round ? `Round ${response.round.round_index}` : 'Captured response'}
        </p>
        <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
          <Metric label="CCI" value={formatNumber(response.cci_result)} />
          <Metric label="CPD" value={formatNumber(response.cpd_result)} />
          <Metric label="X standard" value={formatNumber(response.cci_standard_x)} />
          <Metric label="CVR Ω" value={formatNumber(response.cvr_value)} />
          <Metric label="Reflection" value={`${formatNumber(response.reflection_seconds)}s`} />
          <Metric label="Submitted" value={formatTimestamp(response.submitted_at)} />
        </dl>
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

function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(value)
}

function formatTimestamp(value: string): string {
  return new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))
}
