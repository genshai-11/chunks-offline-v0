import { Badge, Card, CardContent } from '../../../components/primitives'
import type { LearnerState } from '../../../lib/domain/types'

interface LearnerStateBannerProps {
  disabledReason: string | null
  learnerState: LearnerState
}

const titleByState: Record<LearnerState, string> = {
  waiting: 'Waiting to join',
  assigned: 'You are assigned',
  observing: 'Observing this round',
  captured: 'Response captured',
  already_responded: 'Already responded',
  round_closed: 'Round closed',
}

const toneByState: Record<LearnerState, 'info' | 'success' | 'warning'> = {
  waiting: 'info',
  assigned: 'success',
  observing: 'warning',
  captured: 'success',
  already_responded: 'info',
  round_closed: 'warning',
}

export function LearnerStateBanner({ disabledReason, learnerState }: LearnerStateBannerProps) {
  return (
    <Card aria-live="polite" className="border-chunks-hairline bg-white/95">
      <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Badge tone={toneByState[learnerState]}>{titleByState[learnerState]}</Badge>
          <p className="mt-3 text-sm leading-6 text-chunks-body">
            {disabledReason ?? 'Choose the color icon that matches your answer when you are ready.'}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
