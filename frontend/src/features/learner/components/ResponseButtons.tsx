import { Button } from '../../../components/primitives'
import type { LearnerState, ResponseColor } from '../../../lib/domain/types'
import { RESPONSE_SCALE_OPTIONS } from '../../../lib/scoring/responseScale'

interface ResponseButtonsProps {
  disabledReason: string | null
  learnerState: LearnerState
  onRespond: (color: ResponseColor) => void
  submittingColor?: ResponseColor | null
}

export function ResponseButtons({ disabledReason, learnerState, onRespond, submittingColor }: ResponseButtonsProps) {
  const disabled = learnerState !== 'assigned' || Boolean(submittingColor)

  return (
    <section aria-label="Response choices" className="grid grid-cols-4 gap-2 sm:gap-3">
      {RESPONSE_SCALE_OPTIONS.map((response) => (
        <Button
          aria-describedby={disabledReason ? 'response-disabled-reason' : undefined}
          aria-label={submittingColor === response.color ? `Sending ${response.accessibleLabel}` : response.accessibleLabel}
          className={`aspect-square min-h-20 rounded-[2rem] text-3xl shadow-sm transition-transform hover:-translate-y-0.5 sm:min-h-24 sm:text-4xl ${response.toneClass}`}
          disabled={disabled}
          disabledReason={disabledReason ?? (submittingColor ? 'Sending response' : undefined)}
          key={response.color}
          onClick={() => onRespond(response.color)}
          type="button"
        >
          <span aria-hidden="true">{submittingColor === response.color ? '…' : response.icon}</span>
        </Button>
      ))}
      {disabledReason ? <p className="sr-only" id="response-disabled-reason">{disabledReason}</p> : null}
    </section>
  )
}
