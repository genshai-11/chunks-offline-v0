import { Button } from '../../../components/ui/Button'

interface ConfirmBatchActionDialogProps {
  actionLabel: string
  details: string
  isOpen: boolean
  onCancel: () => void
  onConfirm: () => void
}

export function ConfirmBatchActionDialog({
  actionLabel,
  details,
  isOpen,
  onCancel,
  onConfirm,
}: ConfirmBatchActionDialogProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <section
        aria-modal="true"
        className="theme-card w-full max-w-md rounded-3xl border border-chunks-hairline bg-white p-6 shadow-soft"
        role="dialog"
        aria-labelledby="confirm-batch-action-title"
      >
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-chunks-body">Confirm batch action</p>
        <h2 className="mt-2 text-2xl font-semibold text-chunks-ink" id="confirm-batch-action-title">
          {actionLabel}
        </h2>
        <p className="mt-4 text-sm leading-6 text-chunks-body">{details}</p>
        <div className="mt-6 flex flex-wrap justify-end gap-3">
          <Button onClick={onCancel} type="button" variant="secondary">
            Cancel
          </Button>
          <Button onClick={onConfirm} type="button">
            Confirm action
          </Button>
        </div>
      </section>
    </div>
  )
}
