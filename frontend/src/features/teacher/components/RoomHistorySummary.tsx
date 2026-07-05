import { Badge, Card } from '../../../components/primitives'
import type { RoomProgressState } from '../../live-room/progressService'
import type { TeacherRoomState } from '../../live-room/roundService'

interface RoomHistorySummaryProps {
  progressState: RoomProgressState | null
  state: TeacherRoomState
  upcomingCount: number
}

export function RoomHistorySummary({ progressState, state, upcomingCount }: RoomHistorySummaryProps) {
  const capturedCount = progressState?.responses.length ?? 0
  const totalCpd = progressState?.responses.reduce((sum, response) => sum + Number(response.cpd_result ?? 0), 0) ?? 0
  const cciAverage = capturedCount
    ? (progressState?.responses.reduce((sum, response) => sum + Number(response.cci_result ?? 0), 0) ?? 0) / capturedCount
    : 0

  return (
    <Card aria-labelledby="room-history-summary-title" padding="sm" variant="outline">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <Badge tone="brand">History & Queue</Badge>
          <h2 className="mt-2 text-lg font-semibold text-chunks-ink" id="room-history-summary-title">
            {state.room.title} · {state.room.room_code}
          </h2>
          <p className="mt-1 text-sm leading-6 text-chunks-body">
            Review played rounds, response history, and the upcoming sentence queue without relying on internal IDs.
          </p>
        </div>
        <Badge tone={state.currentRound?.status === 'open' ? 'success' : 'neutral'}>
          {state.currentRound ? `Round ${state.currentRound.round_index}` : 'Lobby'}
        </Badge>
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
        <HistoryMetric label="Rounds opened" value={state.rounds.length} />
        <HistoryMetric label="Upcoming" value={upcomingCount} />
        <HistoryMetric label="Captured" value={capturedCount} />
        <HistoryMetric label="Total CPD" value={formatNumber(totalCpd)} />
      </div>
      <p className="mt-3 text-xs font-semibold uppercase tracking-[0.14em] text-chunks-body">
        CCI average {formatNumber(cciAverage)} · {state.availableSentences.length} resources in room snapshot
      </p>
    </Card>
  )
}

function HistoryMetric({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-2xl bg-chunks-soft p-3">
      <p className="text-[0.62rem] font-black uppercase tracking-[0.14em] text-chunks-body">{label}</p>
      <p className="mt-1 font-mono text-lg font-semibold text-chunks-ink">{value}</p>
    </div>
  )
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(value)
}
