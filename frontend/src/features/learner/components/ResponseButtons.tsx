import { Button } from '../../../components/ui/Button'
import type { LearnerState, ResponseColor } from '../../../lib/domain/types'

interface ResponseButtonsProps {
  disabledReason: string | null
  learnerState: LearnerState
  onRespond: (color: ResponseColor) => void
  submittingColor?: ResponseColor | null
}

const responses: Array<{ color: ResponseColor; label: string; helper: string; className: string }> = [
  { color: 'red', label: 'Red', helper: 'Need support', className: 'bg-red-700 hover:bg-red-800' },
  { color: 'yellow', label: 'Yellow', helper: 'Almost there', className: 'bg-yellow-500 text-chunks-ink hover:bg-yellow-600' },
  { color: 'green', label: 'Green', helper: 'I can do it', className: 'bg-green-600 hover:bg-green-700' },
]

export function ResponseButtons({ disabledReason, learnerState, onRespond, submittingColor }: ResponseButtonsProps) {
  const disabled = learnerState !== 'assigned' || Boolean(submittingColor)

  return (
    <section aria-label="Response choices" className="grid gap-3 sm:grid-cols-3">
      {responses.map((response) => (
        <Button
          aria-describedby={disabledReason ? 'response-disabled-reason' : undefined}
          className={`min-h-24 flex-col gap-1 rounded-2xl px-5 py-5 text-lg ${response.className}`}
          disabled={disabled}
          key={response.color}
          onClick={() => onRespond(response.color)}
          type="button"
        >
          <span className="font-black uppercase tracking-[0.18em]">
            {submittingColor === response.color ? 'Sending' : response.label}
          </span>
          <span className="text-sm font-semibold opacity-85">{response.helper}</span>
        </Button>
      ))}
      {disabledReason ? <p className="sr-only" id="response-disabled-reason">{disabledReason}</p> : null}
    </section>
  )
}
