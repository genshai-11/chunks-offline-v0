import { useId } from 'react'
import type { HTMLAttributes, ReactNode } from 'react'

import { cn } from './utils'
import type { CommonPrimitiveProps } from './types'

export type ProgressVariant = 'linear' | 'circular'

interface ProgressProps extends CommonPrimitiveProps, HTMLAttributes<HTMLDivElement> {
  value: number
  max?: number
  label?: ReactNode
  variant?: ProgressVariant
  showValue?: boolean
}

function getPercent(value: number, max: number) {
  if (max <= 0) return 0
  return Math.max(0, Math.min(100, (value / max) * 100))
}

export function Progress({ className, label, max = 100, showValue = false, value, variant = 'linear', ...props }: ProgressProps) {
  const labelId = useId()
  const percent = getPercent(value, max)
  const roundedPercent = Math.round(percent)
  const labelText = showValue ? `${roundedPercent}%` : undefined
  const progressName = typeof label === 'string' ? label : 'Progress'

  if (variant === 'circular') {
    const radius = 18
    const circumference = 2 * Math.PI * radius
    const strokeDashoffset = circumference - (percent / 100) * circumference

    return (
      <div className={cn('inline-flex items-center gap-3', className)} {...props}>
        <svg aria-label={progressName} className="h-12 w-12 -rotate-90 text-chunks-red" role="img" viewBox="0 0 44 44">
          <circle cx="22" cy="22" fill="none" r={radius} stroke="currentColor" strokeOpacity="0.15" strokeWidth="4" />
          <circle cx="22" cy="22" fill="none" r={radius} stroke="currentColor" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round" strokeWidth="4" />
        </svg>
        <div>
          {label ? <div className="text-sm font-medium text-chunks-ink" id={labelId}>{label}</div> : null}
          {labelText ? <div aria-live="polite" className="text-sm text-chunks-body">{labelText}</div> : null}
        </div>
      </div>
    )
  }

  return (
    <div className={cn('space-y-2', className)} {...props}>
      {label ? <div className="text-sm font-medium text-chunks-ink" id={labelId}>{label}</div> : null}
      <div
        aria-label={label ? undefined : progressName}
        aria-labelledby={label ? labelId : undefined}
        aria-valuemax={max}
        aria-valuemin={0}
        aria-valuenow={Math.round(value)}
        className="h-3 overflow-hidden rounded-full bg-chunks-control"
        role="progressbar"
      >
        <div className="h-full rounded-full bg-chunks-red transition-[width] duration-300" style={{ width: `${percent}%` }} />
      </div>
      {labelText ? <div aria-live="polite" className="text-sm text-chunks-body">{labelText}</div> : null}
    </div>
  )
}
