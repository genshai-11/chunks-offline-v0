import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'

import { Button } from './Button'
import { cn } from './utils'
import type { CommonPrimitiveProps, PrimitiveTone } from './types'

interface ToastProps extends CommonPrimitiveProps {
  title: ReactNode
  description?: ReactNode
  tone?: PrimitiveTone
  action?: ReactNode
  duration?: number
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

const toneClassNames: Record<PrimitiveTone, string> = {
  neutral: 'border-chunks-hairline bg-white text-chunks-ink',
  brand: 'border-red-200 bg-red-50 text-red-800',
  success: 'border-green-200 bg-green-50 text-green-800',
  warning: 'border-yellow-200 bg-yellow-50 text-yellow-800',
  error: 'border-red-200 bg-red-50 text-red-800',
  info: 'border-blue-200 bg-blue-50 text-blue-800',
}

export function Toast({ action, className, description, duration = 4500, onOpenChange, open = true, title, tone = 'neutral' }: ToastProps) {
  const [visible, setVisible] = useState(open)

  useEffect(() => {
    setVisible(open)
  }, [open])

  useEffect(() => {
    if (!visible || duration <= 0) return undefined

    const timer = window.setTimeout(() => {
      setVisible(false)
      onOpenChange?.(false)
    }, duration)

    return () => window.clearTimeout(timer)
  }, [duration, onOpenChange, visible])

  if (!visible) return null

  return (
    <div aria-live={tone === 'error' ? 'assertive' : 'polite'} className={cn('w-full max-w-sm rounded-2xl border p-4 shadow-hard', toneClassNames[tone], className)} role={tone === 'error' ? 'alert' : 'status'}>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 space-y-1">
          <p className="font-semibold">{title}</p>
          {description ? <p className="text-sm leading-6 opacity-90">{description}</p> : null}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {action}
          <Button aria-label="Dismiss notification" onClick={() => { setVisible(false); onOpenChange?.(false) }} size="sm" variant="ghost">×</Button>
        </div>
      </div>
    </div>
  )
}
