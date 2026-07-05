import { Button, Dialog } from '../../../components/primitives'

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
  return (
    <Dialog description={details} onOpenChange={(open) => { if (!open) onCancel() }} open={isOpen} title={actionLabel}>
      <div className="flex flex-wrap justify-end gap-3">
        <Button onClick={onCancel} type="button" variant="secondary">
          Cancel
        </Button>
        <Button onClick={onConfirm} type="button" variant="destructive">
          Confirm action
        </Button>
      </div>
    </Dialog>
  )
}
