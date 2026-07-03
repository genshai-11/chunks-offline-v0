import { Alert } from '../../../components/ui/Alert'
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

export function LearnerStateBanner({ disabledReason, learnerState }: LearnerStateBannerProps) {
  const tone = learnerState === 'assigned' ? 'success' : learnerState === 'observing' || learnerState === 'round_closed' ? 'warning' : 'info'

  return (
    <Alert tone={tone} title={titleByState[learnerState]}>
      {disabledReason ?? 'Choose Red, Yellow, or Green when you are ready.'}
    </Alert>
  )
}
