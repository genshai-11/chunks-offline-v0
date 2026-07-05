import { useEffect, useId, useRef } from 'react'
import type { ReactNode } from 'react'

import { Button } from './Button'
import { cn } from './utils'
import type { CommonPrimitiveProps } from './types'

export type DialogVariant = 'modal' | 'alert' | 'confirmation'

interface DialogProps extends CommonPrimitiveProps {
  open: boolean
  title: ReactNode
  children: ReactNode
  description?: ReactNode
  variant?: DialogVariant
  closeLabel?: string
  onOpenChange: (open: boolean) => void
}

const variantClassNames: Record<DialogVariant, string> = {
  modal: 'border-chunks-hairline',
  alert: 'border-red-300',
  confirmation: 'border-yellow-300',
}

export function Dialog({ children, className, closeLabel = 'Close dialog', description, onOpenChange, open, title, variant = 'modal' }: DialogProps) {
  const titleId = useId()
  const descriptionId = useId()
  const dialogRef = useRef<HTMLDivElement | null>(null)
  const lastFocusedElement = useRef<HTMLElement | null>(null)
  const role = variant === 'alert' || variant === 'confirmation' ? 'alertdialog' : 'dialog'

  useEffect(() => {
    if (!open) return undefined

    lastFocusedElement.current = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const focusable = dialogRef.current?.querySelector<HTMLElement>('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')
    focusable?.focus()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onOpenChange(false)
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      lastFocusedElement.current?.focus()
    }
  }, [onOpenChange, open])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <button aria-label={closeLabel} className="absolute inset-0 cursor-default bg-black/50" onClick={() => onOpenChange(false)} type="button" />
      <div
        aria-describedby={description ? descriptionId : undefined}
        aria-labelledby={titleId}
        aria-modal="true"
        className={cn('relative z-10 w-full max-w-2xl rounded-3xl border bg-white p-5 text-chunks-ink shadow-hard sm:p-6', variantClassNames[variant], className)}
        ref={dialogRef}
        role={role}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 space-y-2">
            <h2 className="text-lg font-semibold" id={titleId}>{title}</h2>
            {description ? <p className="text-sm leading-6 text-chunks-body" id={descriptionId}>{description}</p> : null}
          </div>
          <Button aria-label={closeLabel} onClick={() => onOpenChange(false)} size="sm" variant="ghost">×</Button>
        </div>
        <div className="mt-5">{children}</div>
      </div>
    </div>
  )
}
